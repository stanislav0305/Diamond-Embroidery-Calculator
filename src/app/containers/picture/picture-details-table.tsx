import React, { useMemo, useRef } from 'react'
import { Button } from 'react-bootstrap'
import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import { MRT_Localization_RU } from 'material-react-table/locales/ru'
import PictureDetailI, { pictureDetailDefault } from '@shared/interfaces/pictureDetailI'
import PictureDetailEditModal from '@containers/picture/picture-detail-edit-modal'
import PictureDetailRemoveModal from '@containers/picture/picture-detail-remove-modal'
import TableOptionsI from '@shared/interfaces/tableOptionsI'
import { ColumnOrderState, OnChangeFn, SortingState, VisibilityState } from '@tanstack/react-table'
import { ComponentModeType } from '@utils/types/componentModeType'


interface PictureDetailsProps {
    componentMode?: ComponentModeType
    tableOptions: TableOptionsI
    onColumnVisibilityChange: OnChangeFn<VisibilityState>
    onColumnOrderChange: OnChangeFn<ColumnOrderState>
    onSortingChange: OnChangeFn<SortingState>
    pictureDetails: PictureDetailI[]
    currencyHtmlCode: string
    onDetailsChange?: (details: PictureDetailI[]) => void
    onSavedPictureDetail?: (forAdd: boolean, pictureDetail: PictureDetailI) => void
    onRemovedPictureDetail?: (id: string) => void
}

const getTable = (
    pictureDetails: PictureDetailI[],
    columns: MRT_ColumnDef<PictureDetailI>[],
    openPictureDetailEditModal: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => void,
    openPictureDetailRemoveModal: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => void,
    tableOptions: TableOptionsI,
    onColumnVisibilityChange: OnChangeFn<VisibilityState>,
    onColumnOrderChange: OnChangeFn<ColumnOrderState>,
    onSortingChange: OnChangeFn<SortingState>,
    componentMode?: ComponentModeType,
) => {
    return useMaterialReactTable({
        columns,
        data: pictureDetails,
        localization: MRT_Localization_RU,
        initialState: {
            density: 'compact',
        },
        state: {
            columnVisibility: tableOptions.columnVisibility,
            columnOrder: tableOptions.columnOrder,
            sorting: tableOptions.columnSort,
        },
        onColumnVisibilityChange: onColumnVisibilityChange,
        onColumnOrderChange: onColumnOrderChange,
        onSortingChange: onSortingChange,
        enableColumnOrdering: true,
        enableSorting: true,
        enablePagination: true,
        enableBottomToolbar: true,
        enableRowActions: componentMode === 'default',
        renderRowActions: ({ row }) => (
            <>
                <Button as="a"
                    variant="outline-primary"
                    size="sm"
                    className='bi bi-pencil-fill me-3'
                    onClick={(e) => openPictureDetailEditModal(e, row.getValue('id') as string)}
                >
                </Button>
                <Button
                    as="a"
                    variant="outline-danger"
                    size="sm"
                    className='bi bi-trash3-fill me-3'
                    onClick={(e) => openPictureDetailRemoveModal(e, row.getValue('id') as string)}
                >
                </Button>
            </>
        ),
    })
}

export default function PicturesDetailsTable({ componentMode = 'default', ...propsOther }: PictureDetailsProps) {

    //------------------------------------------------------------------------------

    const pictureDetailEditModalRef = useRef<PictureDetailEditModal>({} as PictureDetailEditModal)
    const openPictureDetailEditModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
        e.preventDefault()
        const pictureDetail = id ? propsOther.pictureDetails.find(item => item.id === id) ?? pictureDetailDefault : pictureDetailDefault
        pictureDetailEditModalRef.current.onOpen(pictureDetail)
    }

    const onSavedPictureDetail = (forAdd: boolean, pictureDetail: PictureDetailI) => {
        console.info('Updating the table of materials of a painting after adding or updating the material!')

        const pd = forAdd ? propsOther.pictureDetails : propsOther.pictureDetails.filter(item => item.id !== pictureDetail.id)
        propsOther.onDetailsChange && propsOther.onDetailsChange([...pd, pictureDetail])
    }

    //------------------------------------------------------------------------------

    const pictureDetailRemoveModalRef = useRef<PictureDetailRemoveModal>({} as PictureDetailRemoveModal)
    const openPictureDetailRemoveModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
        e.preventDefault()
        pictureDetailRemoveModalRef.current.onOpen(id)
    }

    const onRemovedPictureDetail = (id: string) => {
        console.info('Updating the table of materials of the painting, after removing the material!')
        propsOther.onDetailsChange && propsOther.onDetailsChange(propsOther.pictureDetails.filter(item => item.id !== id))
    }

    //------------------------------------------------------------------------------

    const columns = useMemo<MRT_ColumnDef<PictureDetailI>[]>(
        () =>
            [
                {
                    header: '#',
                    accessorKey: 'id',
                    sortDescFirst: false,
                },
                {
                    header: 'Название',
                    accessorKey: 'name',
                    sortUndefined: 'last',
                    sortDescFirst: false,
                },
                {
                    header: 'Цена',
                    accessorKey: 'price',
                    accessorFn: row => `${row.price.toFixed(2)} ${propsOther.currencyHtmlCode}`,
                    filterVariant: 'range',
                    sortUndefined: 'last',
                    sortDescFirst: false,
                }
            ],
        [propsOther.currencyHtmlCode])

    const table = getTable(
        propsOther.pictureDetails,
        columns,
        openPictureDetailEditModal,
        openPictureDetailRemoveModal,
        propsOther.tableOptions,
        propsOther.onColumnVisibilityChange,
        propsOther.onColumnOrderChange,
        propsOther.onSortingChange,
        componentMode,
    )

    return (
        <>
            <div className='position-relative'>
                {componentMode === 'default' &&
                    <Button as="a"
                        variant="outline-success"
                        size="sm"
                        className='bi bi-plus-square-fill position-absolute mt-2 mx-2 z-index-10'
                        onClick={(e) => openPictureDetailEditModal(e, '')}
                    >
                    </Button>
                }
                <MaterialReactTable table={table} />
            </div>

            <PictureDetailEditModal ref={pictureDetailEditModalRef} onSaved={propsOther.onSavedPictureDetail ?? onSavedPictureDetail} />
            <PictureDetailRemoveModal ref={pictureDetailRemoveModalRef} onRemoved={propsOther.onRemovedPictureDetail ?? onRemovedPictureDetail} />
        </>
    )
}