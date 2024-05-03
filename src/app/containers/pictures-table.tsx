import React, { useMemo, useRef } from 'react'
import { Button } from 'react-bootstrap'
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table'
import PictureI from '@shared/interfaces/pictureI'
import getData from '@utils/getData'
import { diamondFormDataMap } from '@shared/types/diamondFormType'
import { coverageAreasDataMap } from '@shared/types/coverageAreaType'
import MapToArrayConverter from '@utils/helpers/mapToArrayConverter'
import { Row } from '@tanstack/react-table'
import PicturEditModal from '@containers/picture-edit-modal'
import PicturRemoveModal from './picture-remove-modal'


const data: PictureI[] = getData(35)

export default function PicturesTable() {

  const columns = useMemo<MRT_ColumnDef<PictureI>[]>(
    () =>
      [
        {
          header: '#',
          accessorKey: 'id',
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
          onClick={(e) => openPictureEditModal(e, row.getValue('id') as number)}
        >
        </Button>
        <Button
          as="a"
          variant="outline-danger"
          size="sm"
          className='bi bi-trash3-fill me-3'
          onClick={(e) => openPictureRemoveModal(e, row.getValue('id') as number)}
        >
        </Button>
      </>
    ),
  });

  //------------------------------------------------------------------------------

  const pictureEditModalRef = useRef<null | PicturEditModal>(null)
  const openPictureEditModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: number) => {
    e.preventDefault()
    pictureEditModalRef.current?.onOpen(id)
  }

  const onSavedPicture = (forAdd: boolean, picture: PictureI) => {
    console.log('Refresh table !')
  }

  //------------------------------------------------------------------------------

  const pictureRemoveModalRef = useRef<null | PicturRemoveModal>(null)
  const openPictureRemoveModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: number) => {
    e.preventDefault()
    pictureRemoveModalRef.current?.onOpen(id)
  }

  const onRemovedPicture = (id: number) => {
    console.log('Refresh table !')
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
          onClick={(e) => openPictureEditModal(e, 0)}
        >
        </Button>
        <MaterialReactTable table={table} />
      </div>

      <PicturEditModal ref={pictureEditModalRef} onSaved={onSavedPicture} />
      <PicturRemoveModal ref={pictureRemoveModalRef} onRemoved={onRemovedPicture} />
    </>
  )
}