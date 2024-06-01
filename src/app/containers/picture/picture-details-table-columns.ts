//import { useMemo } from "react"
import { MRT_ColumnDef } from "material-react-table"
import PictureDetailI from "@shared/interfaces/pictureDetailI"


export const columns: MRT_ColumnDef<PictureDetailI>[] = [
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
