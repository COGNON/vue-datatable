import type { VCellSeparators } from '@/components/types'
import { computed } from 'vue'

type Props = {
  borders: VCellSeparators
  bordered: boolean
  highlightOnHover: boolean
  stripedRows: boolean
}

export default function useTableCls(props: Props) {
  const cellBorderCls = computed(() => {
    if (props.borders === 'none') return ''

    console.log(props.borders)

    const cls = []
    if (props.borders.match(/column|cell/)) cls.push('vdt--cell-borders')
    if (props.borders.match(/row|cell/)) cls.push('vdt--row-borders')

    return cls.join(' ')
  })

  const tableBorderCls = computed(() => (props.bordered ? 'vdt--table-border' : ''))
  const hoverCls = computed(() => (props.highlightOnHover ? 'vdt--row-highlight' : ''))
  const stripedCls = computed(() => (props.stripedRows ? 'vdt--striped-rows' : ''))

  return { cellBorderCls, tableBorderCls, hoverCls, stripedCls }
}
