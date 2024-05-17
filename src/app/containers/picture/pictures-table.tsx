import React, { useEffect, useMemo, useRef } from 'react'
import { Button } from 'react-bootstrap'
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table'
import PictureI, { pictureDefault } from '@shared/interfaces/pictureI'
import { diamondFormDataMap } from '@shared/types/diamondFormType'
import { coverageAreasDataMap } from '@shared/types/coverageAreaType'
import MapToArrayConverter from '@utils/helpers/mapToArrayConverter'
import { Row } from '@tanstack/react-table'
import PicturEditModal from '@containers/picture/picture-edit-modal'
import PicturRemoveModal from '@containers/picture/picture-remove-modal'
import PictureDefaultSetModal from '@containers/picture/picture-default-set-modal'


export default function PicturesTable() {

  const [data, setData] = React.useState<PictureI[]>([])

  useEffect(() => {
    window.api.pictures.getAll()
      .then(result => setData(result))
  }, [])



  const columns = useMemo<MRT_ColumnDef<PictureI>[]>(
    () =>
      [
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
          id: 'diamondForm',
          accessorFn: row => diamondFormDataMap.get(row.diamondForm),
          filterSelectOptions: MapToArrayConverter.toDropdownOptionsValues(diamondFormDataMap),
          filterVariant: 'select',
          sortUndefined: 'last',
          sortDescFirst: false,
        },
        {
          header: 'Площадь покрытия',
          id: 'coverageArea',
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
            min: 1,
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
            min: 1,
          }
        },
        {
          header: 'Продано за',
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

  const table = useMaterialReactTable({
    columns,
    data,
    initialState: {
      density: 'compact',
    },
    filterFns: {
      heightWidthFilterFn: (row: Row<PictureI>, columnId: string, filterValue: number[]) => {
        const height: number = row.getValue('height')
        const width: number = row.getValue('width')
        const min = filterValue[0]
        const max = filterValue[1]

        let result = false
        if (!min && !max) {
          //оба неопределены
          result = true
        } else if (!!min && !max) {
          //только min
          result = height >= min || width >= min
        } else if (!min && !!max) {
          //только max
          result = height <= max || width <= max
        } else {
          //оба определены
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
    ),
  });

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
        <MaterialReactTable table={table} />
      </div>

      <PicturEditModal ref={pictureEditModalRef} onSaved={onSavedPicture} />
      <PicturRemoveModal ref={pictureRemoveModalRef} onRemoved={onRemovedPicture} />
      <PictureDefaultSetModal ref={pictureDetailsDefaultSetModalRef} />
    </>
  )
}