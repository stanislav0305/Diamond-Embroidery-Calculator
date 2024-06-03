import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Image } from 'react-bootstrap'
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table'
import { MRT_Localization_RU } from 'material-react-table/locales/ru'
import PictureI, { pictureDefault } from '@shared/interfaces/pictureI'
import { diamondFormDataMap } from '@shared/types/diamondFormType'
import { coverageAreasDataMap } from '@shared/types/coverageAreaType'
import MapToArrayConverter from '@utils/helpers/mapToArrayConverter'
import { ColumnFilter, ColumnOrderState, Row, SortingState, Updater } from '@tanstack/react-table'
import PicturEditModal from '@containers/picture/picture-edit-modal'
import PicturRemoveModal from '@containers/picture/picture-remove-modal'
import PictureDefaultSetModal from '@containers/picture/picture-default-set-modal'
import PictureImageI from '@shared/interfaces/pictureImageI'
import { AppSettingsContext } from '@contexts/app-settings-context-provider'
import TableOptionsI from '@shared/interfaces/tableOptionsI'
import { ColumnSortI } from '@shared/interfaces/columnSortI'
import { ComponentModeType } from '@utils/types/componentModeType'
import SimilarPicturesFilter from '@shared/classes/similarPicturesFilter'


export interface PicturesTableProps {
  componentMode?: ComponentModeType
  filter?: SimilarPicturesFilter
}

export default function PicturesTable({ componentMode = 'default', filter }: PicturesTableProps) {
  useEffect(() => {
    const query = componentMode === 'default'
      ? window.api.pictures.tableOptions.get()
      : window.api.similarPictures.tableOptions.get()

    query.then((opts: TableOptionsI) => {
      setColumnVisibility(opts.columnVisibility)
      setColumnOrder(opts.columnOrder)
      setColumnSorting(opts.columnSort)


      window.api.pictures.getAll()
        .then(result => {

          if (componentMode === 'readonly' && (typeof filter !== 'undefined')) {
            //exclude current opened picture
            result = filter.excludeId ? result.filter(i => i.id !== filter.excludeId) : result
          }

          setData(result)
        })
    })
  }, [])


  const [data, setData] = useState<PictureI[]>([])


  const appSettingsContext = useContext(AppSettingsContext)
  const pictureImagesPath = appSettingsContext.appSettings.paths.pictureImagesPath
  function getImgSrcOrDefault(img: PictureImageI | undefined) {
    const src = !img ? ' ' : `${pictureImagesPath}/${img!.id}.${img!.ext}`
    return src
  }

  const columns = useMemo<MRT_ColumnDef<PictureI>[]>(
    () =>
      [
        {
          header: 'Фото',
          accessorKey: 'photo',
          enableColumnFilter: false,
          enableSorting: false,
          size: 82,
          accessorFn: (row) => `${getImgSrcOrDefault(row.images.find(i => i.isMain))}`,
          Cell: ({ cell }) => (
            <Image
              className="bg-secondary"
              style={{ minWidth: "82px", minHeight: "82px" }}
              thumbnail
              src={cell.getValue<string>()}
            />
          ),
        },
        {
          header: '#',
          accessorKey: 'id',
          sortDescFirst: false,
        },
        {
          header: 'Создана',
          accessorKey: 'created',
          sortDescFirst: false,
        },
        {
          header: 'Обновлена',
          accessorKey: 'updated',
          sortUndefined: 'last',
          sortDescFirst: false,
        },
        {
          header: 'Высота',
          accessorKey: 'height',
          filterFn: 'heightWidthFilterFn',
          filterVariant: 'range',
          sortUndefined: 'last',
          sortDescFirst: false,

        },
        {
          header: 'Ширина',
          accessorKey: 'width',
          filterFn: 'heightWidthFilterFn',
          filterVariant: 'range',
          sortUndefined: 'last',
          sortDescFirst: false,
        },
        {
          header: 'Форма кристала',
          accessorKey: 'diamondForm',
          accessorFn: row => diamondFormDataMap.get(row.diamondForm),
          filterSelectOptions: MapToArrayConverter.toDropdownOptionsValues(diamondFormDataMap),
          filterVariant: 'select',
          sortUndefined: 'last',
          sortDescFirst: false,
        },
        {
          header: 'Площадь покрытия',
          accessorKey: 'coverageArea',
          accessorFn: row => coverageAreasDataMap.get(row.coverageArea),
          filterSelectOptions: MapToArrayConverter.toDropdownOptionsValues(coverageAreasDataMap),
          filterVariant: 'select',
          sortUndefined: 'last',
          sortDescFirst: false,
        },
        {
          header: 'Цена за час',
          accessorKey: 'pricePerHour',
          accessorFn: row => row.pricePerHour.toLocaleString('ru-RU', {
            style: 'currency',
            currency: 'EUR'
          }),
          sortUndefined: 'last',
          sortDescFirst: false,
          filterVariant: 'range-slider',
          muiFilterSliderProps: {
            marks: true,
            max: 1000,
            min: 0,
            step: 1,
            valueLabelFormat: (value) =>
              value.toLocaleString('ru-RU', {
                style: 'currency',
                currency: 'EUR'
              }),
          }
        },
        {
          header: 'Затрачено часов',
          accessorKey: 'hoursSpent',
          sortUndefined: 'last',
          sortDescFirst: false,
          filterVariant: 'range-slider',
          muiFilterSliderProps: {
            marks: true,
            max: 100,
            min: 0,
          }
        },
        {
          header: 'Продано за',
          accessorKey: 'bayFullPrice',
          accessorFn: row => row.bayFullPrice.toLocaleString('ru-RU', {
            style: 'currency',
            currency: 'EUR'
          }),
          sortUndefined: 'last',
          sortDescFirst: false,
          filterVariant: 'range',
        },
        {
          header: 'Коментарий',
          accessorKey: 'comment',
          sortUndefined: 'last',
          sortDescFirst: false,
        },
      ],
    []
  )

  //--------------------------------------------------------


  const [columnVisibility, setColumnVisibility] = useState({})
  const onColumnVisibilityChange = (updater: Updater<object>) => {
    setColumnVisibility((prev) => {
      const model = (updater instanceof Function ? updater(prev) : updater) as object
      const query = componentMode === 'default'
        ? window.api.pictures.tableOptions
        : window.api.similarPictures.tableOptions

      query.setColumnVisibility(model)

      return model
    })
  }

  const [columnOrder, setColumnOrder] = useState<string[]>([])
  const onColumnOrderChange = (updater: Updater<ColumnOrderState>) => {
    setColumnOrder((prev) => {
      const model = (updater instanceof Function ? updater(prev as ColumnOrderState) : updater) as string[]

      if (prev && model && prev.length > 0 && model.length > 0 &&
        model.filter((item, index) => { return prev[index] !== item }).length > 0) {
        //save only if arrays are defferent
        const query = componentMode === 'default'
          ? window.api.pictures.tableOptions
          : window.api.similarPictures.tableOptions

        query.setColumnOrder(model)
      }

      return model
    })
  }

  const [columnSorting, setColumnSorting] = useState<ColumnSortI[]>([])
  const onSortingChange = (updater: Updater<SortingState>) => {
    setColumnSorting((prev) => {
      const model = (updater instanceof Function ? updater(prev as SortingState) : updater) as ColumnSortI[]

      if (prev && model
        && ((prev.length !== model.length)
          || (model.filter((item, index) => { return (prev[index].id !== item.id || prev[index].desc !== item.desc) }).length > 0))) {
        //save only if arrays are defferent
        const query = componentMode === 'default'
          ? window.api.pictures.tableOptions
          : window.api.similarPictures.tableOptions

        query.setColumnSort(model)
      }

      return model
    })
  }

  //--------------------------------------------------------

  const table = useMaterialReactTable({
    columns,
    data,
    localization: MRT_Localization_RU,
    initialState: {
      density: 'compact',
      showColumnFilters: componentMode === 'readonly',
      columnFilters: componentMode === 'readonly' && (typeof filter !== 'undefined') ? filter.columnFiltersInit : [] as ColumnFilter[]
    },
    state: {
      columnVisibility,
      columnOrder,
      sorting: columnSorting
    },

    onColumnVisibilityChange: onColumnVisibilityChange,
    onColumnOrderChange: onColumnOrderChange,
    onSortingChange: onSortingChange,
    filterFns: {
      heightWidthFilterFn: (row: Row<PictureI>, columnId: string, filterValue: number[]) => {
        const height: number = row.getValue('height')
        const width: number = row.getValue('width')
        const min = filterValue[0]
        const max = filterValue[1]

        let result = false
        if (!min && !max) {
          //both are undefined
          result = true
        } else if (!!min && !max) {
          //min only
          result = height >= min || width >= min
        } else if (!min && !!max) {
          //max only
          result = height <= max || width <= max
        } else {
          //both defined
          result = (height >= min && height <= max) || (width >= min && width <= max)
        }

        return result
      }
    },
    enableColumnOrdering: true,
    enableSorting: true,
    enablePagination: true,
    enableBottomToolbar: true,
    enableRowActions: true,
    renderRowActions: ({ row }) => (
      <>
        {componentMode === 'default' &&
          <>
            <Button as="a"
              variant="outline-primary"
              size="sm"
              className='bi bi-pencil-fill me-3'
              onClick={(e) => openPictureEditModal(e, row.getValue('id') as string)}
            >
            </Button>
            <Button
              as="a"
              variant="outline-danger"
              size="sm"
              className='bi bi-trash3-fill me-3'
              onClick={(e) => openPictureRemoveModal(e, row.getValue('id') as string)}
            >
            </Button>
          </>
        }
        {componentMode === 'readonly' &&
          <Button
            as="a"
            variant="outline-primary"
            size="sm"
            className='bi bi-eye-fill me-3'
            onClick={(e) => openPictureEditModal(e, row.getValue('id') as string)}
          >
          </Button>
        }
      </>
    ),
  })

  //------------------------------------------------------------------------------

  const pictureEditModalRef = useRef<PicturEditModal>({} as PicturEditModal)
  const openPictureEditModal = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
    e.preventDefault()
    const picture = id ? data.find(picture => picture.id === id) ?? pictureDefault : pictureDefault

    if (id) {
      picture.details = picture.details
    }
    else if (!id || !picture) {
      await window.api.picturesDefaultSet.get()
        .then(defaultSet => {
          picture.details = defaultSet.details
          picture.detailsSumTotal = defaultSet.detailsSumTotal
          picture.pricePerHour = defaultSet.pricePerHour
        })
    }

    pictureEditModalRef.current.onOpen(picture)
  }

  const onSavedPicture = (forAdd: boolean, picture: PictureI) => {
    console.info('Updating the painting table after adding or updating a painting!')

    const d = forAdd ? data : data.filter(p => p.id !== picture.id)
    setData([...d, picture])
  }

  //------------------------------------------------------------------------------

  const pictureRemoveModalRef = useRef<PicturRemoveModal>({} as PicturRemoveModal)
  const openPictureRemoveModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
    e.preventDefault()
    pictureRemoveModalRef.current.onOpen(id)
  }

  const onRemovedPicture = (id: string) => {
    console.info('Updating the table of paintings after deleting a painting!')
    setData(data.filter(picture => picture.id !== id))
  }

  //------------------------------------------------------------------------------

  const pictureDetailsDefaultSetModalRef = useRef<PictureDefaultSetModal>({} as PictureDefaultSetModal)
  const openPicturDetailsTableModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    pictureDetailsDefaultSetModalRef.current.onOpen()
  }

  //------------------------------------------------------------------------------

  return (
    <>
      <h4>Картины</h4>

      <div className='position-relative'>
        {componentMode === 'default' &&
          <>
            <Button as="a"
              variant="outline-success"
              size="sm"
              className='bi bi-plus-square-fill position-absolute mt-2 mx-2 z-index-10'
              title='Добавить картинe'
              onClick={(e) => openPictureEditModal(e, '')}
            >
            </Button>
            <Button as="a"
              variant='outline-primary'
              size="sm"
              className='bi bi-text-center position-absolute mt-2 ms-5 z-index-10'
              title='Данные по умолчанию'
              onClick={openPicturDetailsTableModal}>
            </Button>
          </>
        }
        <MaterialReactTable table={table} />
      </div>

      <PicturEditModal ref={pictureEditModalRef} componentMode={componentMode} onSaved={onSavedPicture} />
      <PicturRemoveModal ref={pictureRemoveModalRef} onRemoved={onRemovedPicture} />
      <PictureDefaultSetModal ref={pictureDetailsDefaultSetModalRef} />
    </>
  )
}