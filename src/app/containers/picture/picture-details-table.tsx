import React, { useRef } from 'react'
import { Button } from 'react-bootstrap'
import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import { MRT_Localization_RU } from 'material-react-table/locales/ru'
import PictureDetailI, { pictureDetailDefault } from '@shared/interfaces/pictureDetailI'
import PicturDetailEditModal from '@containers/picture/picture-detail-edit-modal'
import PicturDetailRemoveModal from '@containers/picture/picture-detail-remove-modal'
import TableOptionsI from '@shared/interfaces/tableOptionsI'
import { columns } from '@containers/picture/picture-details-table-columns'
import { ColumnOrderState, OnChangeFn, SortingState, VisibilityState } from '@tanstack/react-table'


interface PictureDetailsProps {
    tableOptions: TableOptionsI
    onColumnVisibilityChange: OnChangeFn<VisibilityState>
    onColumnOrderChange: OnChangeFn<ColumnOrderState>
    onSortingChange:OnChangeFn<SortingState>
    pictureDetails: PictureDetailI[]
    onDetailsChenge?: (details: PictureDetailI[]) => void
    onSavedPictureDetail?: (forAdd: boolean, pictureDetail: PictureDetailI) => void
    onRemovedPictureDetail?: (id: string) => void
}

const getTable = (pictureDetails: PictureDetailI[],
    columns: MRT_ColumnDef<PictureDetailI>[],
    openPictureDetailEditModal: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => void,
    openPictureDetailRemoveModal: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => void,
    tableOptions: TableOptionsI,
    onColumnVisibilityChange: OnChangeFn<VisibilityState>,
    onColumnOrderChange: OnChangeFn<ColumnOrderState>,
    onSortingChange: OnChangeFn<SortingState>
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
        enableRowActions: true,
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

export default function PicturesDetailsTable(props: PictureDetailsProps) {

    //------------------------------------------------------------------------------

    const pictureDetailEditModalRef = useRef<PicturDetailEditModal>({} as PicturDetailEditModal)
    const openPictureDetailEditModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
        e.preventDefault()
        const pictutreDetail = id ? props.pictureDetails.find(item => item.id === id) ?? pictureDetailDefault : pictureDetailDefault
        pictureDetailEditModalRef.current.onOpen(pictutreDetail)
    }

    const onSavedPictureDetail = (forAdd: boolean, pictureDetail: PictureDetailI) => {
        console.info('Updating the table of materials of a painting after adding or updating the material!')

        const pd = forAdd ? props.pictureDetails : props.pictureDetails.filter(item => item.id !== pictureDetail.id)
        props.onDetailsChenge && props.onDetailsChenge([...pd, pictureDetail])
    }

    //------------------------------------------------------------------------------

    const pictureDetailRemoveModalRef = useRef<PicturDetailRemoveModal>({} as PicturDetailRemoveModal)
    const openPictureDetailRemoveModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
        e.preventDefault()
        pictureDetailRemoveModalRef.current.onOpen(id)
    }

    const onRemovedPictureDetail = (id: string) => {
        console.info('Updating the table of materials of the painting, after removing the metamaterial!')
        props.onDetailsChenge && props.onDetailsChenge(props.pictureDetails.filter(item => item.id !== id))
    }

    //------------------------------------------------------------------------------

    const table = getTable(
        props.pictureDetails,
        columns,
        openPictureDetailEditModal,
        openPictureDetailRemoveModal,
        props.tableOptions,
        props.onColumnVisibilityChange,
        props.onColumnOrderChange,
        props.onSortingChange
    )

    return (
        <>
            <div className='position-relative'>
                <Button as="a"
                    variant="outline-success"
                    size="sm"
                    className='bi bi-plus-square-fill position-absolute mt-2 mx-2 z-index-10'
                    onClick={(e) => openPictureDetailEditModal(e, '')}
                >
                </Button>
                <MaterialReactTable table={table} />
            </div>

            <PicturDetailEditModal ref={pictureDetailEditModalRef} onSaved={props.onSavedPictureDetail ?? onSavedPictureDetail} />
            <PicturDetailRemoveModal ref={pictureDetailRemoveModalRef} onRemoved={props.onRemovedPictureDetail ?? onRemovedPictureDetail} />
        </>
    )
}