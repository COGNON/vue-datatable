import { computed } from 'vue';

export default function useTableCls(props) {
  const cellBorderCls = computed(() => {
    if (props.borders === 'none') return '';

    const cls = [];
    if (props.borders.match(/both|cell/)) cls.push('vdt--cell-borders');
    if (props.borders.match(/both|row/)) cls.push('vdt--row-borders');

    return cls.join(' ');
  });

  const tableBorderCls = computed(() => (props.bordered ? 'vdt--table-border' : ''));
  const hoverCls = computed(() => (props.hightlightOnHover ? 'vdt--row-highlight' : ''));
  const stripedCls = computed(() => (props.stripedRows ? 'vdt--striped-rows' : ''));

  return { cellBorderCls, tableBorderCls, hoverCls, stripedCls };
}
