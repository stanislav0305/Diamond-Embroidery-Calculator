import React, { useMemo, useRef } from 'react'
import { Button } from 'react-bootstrap'
import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import { PictureDetailI, pictureDetailDefault } from '@shared/interfaces/pictureI'
import PicturDetailEditModal from '@containers/picture/picture-detail-edit-modal'
import PicturDetailRemoveModal from '@containers/picture/picture-detail-remove-modal'


interface PictureDetailsProps {
    pictureDetails: PictureDetailI[],
    onDetailsChenge: (details: PictureDetailI[]) => void
}

const getTable = (pictureDetails: PictureDetailI[],
    columns: MRT_ColumnDef<PictureDetailI>[],
    openPictureDetailEditModal: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => void,
    openPictureDetailRemoveModal: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => void
) => {
    return useMaterialReactTable({
        columns,
        data: pictureDetails,
        initialState: {
            density: 'compact',
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
                    accessorFn: row => row.price.toLocaleString('ru-RU', {
                        style: 'currency',
                        currency: 'EUR'
                    }),
                    filterVariant: 'range',
                    sortUndefined: 'last',
                    sortDescFirst: false,
                }
            ]
        ,
        []
    )

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
        props.onDetailsChenge([...pd, pictureDetail])
    }

    //------------------------------------------------------------------------------

    const pictureDetailRemoveModalRef = useRef<PicturDetailRemoveModal>({} as PicturDetailRemoveModal)
    const openPictureDetailRemoveModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
        e.preventDefault()
        pictureDetailRemoveModalRef.current.onOpen(id)
    }

    const onRemovedPictureDetail = (id: string) => {
        console.info('Updating the table of materials of the painting, after removing the metamaterial!')
        props.onDetailsChenge(props.pictureDetails.filter(item => item.id !== id))
    }

    //------------------------------------------------------------------------------

    const table = getTable(props.pictureDetails,
        columns,
        openPictureDetailEditModal,
        openPictureDetailRemoveModal
    )

    return (
        <>
            <h6>Материалы картины</h6>
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

            <PicturDetailEditModal ref={pictureDetailEditModalRef} onSaved={onSavedPictureDetail} />
            <PicturDetailRemoveModal ref={pictureDetailRemoveModalRef} onRemoved={onRemovedPictureDetail} />
        </>
    )
}