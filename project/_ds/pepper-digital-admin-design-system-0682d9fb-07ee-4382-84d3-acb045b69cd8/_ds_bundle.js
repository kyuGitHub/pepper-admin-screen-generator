/* @ds-bundle: {"format":4,"namespace":"PepperDigitalAdminDesignSystem_0682d9","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"ICON_NAMES","sourcePath":"components/core/Icon.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"Separator","sourcePath":"components/core/Separator.jsx"},{"name":"DataGrid","sourcePath":"components/data/DataGrid.jsx"},{"name":"FieldTable","sourcePath":"components/data/FieldTable.jsx"},{"name":"Panel","sourcePath":"components/data/Panel.jsx"},{"name":"StatTile","sourcePath":"components/data/StatTile.jsx"},{"name":"StatusCircle","sourcePath":"components/data/StatusCircle.jsx"},{"name":"StepProgress","sourcePath":"components/data/StepProgress.jsx"},{"name":"SummaryStat","sourcePath":"components/data/SummaryStat.jsx"},{"name":"AlertModal","sourcePath":"components/feedback/AlertModal.jsx"},{"name":"Loading","sourcePath":"components/feedback/Loading.jsx"},{"name":"Modal","sourcePath":"components/feedback/Modal.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"ChoiceControl","sourcePath":"components/forms/ChoiceControl.jsx"},{"name":"DateInput","sourcePath":"components/forms/DateInput.jsx"},{"name":"DateRange","sourcePath":"components/forms/DateRange.jsx"},{"name":"Datepicker","sourcePath":"components/forms/Datepicker.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"InputGroup","sourcePath":"components/forms/InputGroup.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"RadioGroup","sourcePath":"components/forms/Radio.jsx"},{"name":"SearchBar","sourcePath":"components/forms/SearchBar.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"AppHeader","sourcePath":"components/navigation/AppHeader.jsx"},{"name":"Lnb","sourcePath":"components/navigation/Lnb.jsx"},{"name":"Pills","sourcePath":"components/navigation/Pills.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/core/Button.jsx":"d9619e5d9c3b","components/core/Icon.jsx":"7317aa3d01a3","components/core/Separator.jsx":"1f5154e4df0a","components/data/DataGrid.jsx":"40255d65bfdd","components/data/FieldTable.jsx":"8e665d62d4c9","components/data/Panel.jsx":"9039043e86b4","components/data/StatTile.jsx":"9af817be0a2d","components/data/StatusCircle.jsx":"b9beab3b7723","components/data/StepProgress.jsx":"d272d9f6c2f8","components/data/SummaryStat.jsx":"2da372e1e3da","components/feedback/AlertModal.jsx":"298d4f9205bf","components/feedback/Loading.jsx":"24523cc61566","components/feedback/Modal.jsx":"c0c543c8def3","components/forms/Checkbox.jsx":"d4ee5d281b29","components/forms/ChoiceControl.jsx":"3ba0cbee9a12","components/forms/DateInput.jsx":"e752c8116c89","components/forms/DateRange.jsx":"16212bddecf2","components/forms/Datepicker.jsx":"0fb1f5a2c6b3","components/forms/Input.jsx":"b0319d0633bb","components/forms/InputGroup.jsx":"867cbb69585e","components/forms/Radio.jsx":"47093df9e7a5","components/forms/SearchBar.jsx":"e4101ddd2051","components/forms/Select.jsx":"47b7a8b58dad","components/forms/Textarea.jsx":"a1bbc73d3eb3","components/navigation/AppHeader.jsx":"222ecfd2bc7b","components/navigation/Lnb.jsx":"913dd1605ee6","components/navigation/Pills.jsx":"59ab9acb7813","components/navigation/Tabs.jsx":"575862b97442","ui_kits/admin/ApplicationListScreen.jsx":"5ac24efe5054","ui_kits/admin/CustomerScreen.jsx":"e95174e13980","ui_kits/admin/DashboardScreen.jsx":"f77c6ceedf13","ui_kits/admin/LoginScreen.jsx":"4daae6e1c7f1","ui_kits/admin/NoticeScreen.jsx":"f8b54a4daf0c","ui_kits/admin/Shell.jsx":"4e7f84cbd614"},"inlinedExternals":[],"unexposedExports":[{"name":"fieldBase","sourcePath":"components/forms/Input.jsx"},{"name":"fieldState","sourcePath":"components/forms/Input.jsx"},{"name":"fmtDate","sourcePath":"components/forms/Datepicker.jsx"},{"name":"parseDate","sourcePath":"components/forms/Datepicker.jsx"}]} */

(() => {

const __ds_ns = (window.PepperDigitalAdminDesignSystem_0682d9 = window.PepperDigitalAdminDesignSystem_0682d9 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
const base = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 4,
  boxSizing: 'border-box',
  minWidth: 54,
  minHeight: 24,
  padding: '2px 10px',
  lineHeight: 1.5,
  borderRadius: 4,
  fontSize: 12,
  fontFamily: 'var(--font-sans)',
  fontWeight: 400,
  border: '1px solid transparent',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  userSelect: 'none',
  transition: 'var(--transition-btn)',
  textDecoration: 'none'
};
function look(variant, size, hover, disabled) {
  const lg = size === 'lg';
  switch (variant) {
    case 'primary':
      return {
        border: 'none',
        background: disabled ? 'var(--pp-navy-100)' : hover ? 'var(--pp-navy-500)' : 'var(--pp-navy-800)',
        color: '#fff'
      };
    case 'outline':
      if (lg) return disabled ? {
        border: '1px solid var(--pp-navy-100)',
        background: '#fff',
        color: 'var(--pp-navy-100)'
      } : {
        border: `1px solid ${hover ? 'var(--pp-navy-500)' : 'var(--pp-navy-800)'}`,
        background: '#fff',
        color: hover ? 'var(--pp-navy-500)' : 'var(--pp-navy-800)'
      };
      if (disabled) return {
        border: '1px solid var(--pp-navy-200)',
        background: '#eee',
        color: 'var(--pp-navy-200)',
        fontWeight: 500
      };
      return {
        border: `1px solid ${hover ? 'var(--pp-navy-800)' : 'var(--pp-gray-350)'}`,
        background: '#fff',
        color: hover ? 'var(--pp-navy-800)' : 'var(--pp-gray-700)',
        fontWeight: 500
      };
    case 'addon':
      return {
        minWidth: 24,
        padding: '2px 5px',
        border: `1px solid ${hover ? 'var(--pp-navy-800)' : 'var(--pp-gray-200)'}`,
        background: 'var(--pp-gray-40)',
        color: hover ? 'var(--pp-navy-800)' : 'var(--pp-gray-700)'
      };
    case 'danger':
      return {
        border: `1px solid ${hover ? '#bd2130' : 'var(--bs-danger)'}`,
        background: hover ? '#c82333' : 'var(--bs-danger)',
        color: '#fff',
        opacity: disabled ? .65 : 1
      };
    case 'success-outline':
      return {
        border: '1px solid var(--bs-success)',
        background: hover ? 'var(--bs-success)' : '#fff',
        color: hover ? '#fff' : 'var(--bs-success)'
      };
    case 'ghost':
    default:
      return {
        background: 'transparent',
        color: '#212529'
      };
  }
}
const sizes = {
  md: {},
  lg: {
    minWidth: 100,
    minHeight: 40,
    padding: '6px 12px',
    fontSize: 16,
    fontWeight: 700
  },
  sm: {
    minWidth: 24,
    minHeight: 24,
    padding: '0 2px',
    fontSize: 14
  },
  icon: {
    minWidth: 24,
    minHeight: 24,
    padding: '2px 4px'
  }
};
function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  style,
  onClick,
  type = 'button',
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const h = hover && !disabled;
  const v = look(variant, size, h, disabled);
  const s = sizes[size] || {};
  const merged = {
    ...base,
    ...s,
    ...v,
    ...(size === 'lg' ? {
      fontWeight: 700
    } : {}),
    ...(disabled ? {
      cursor: 'default'
    } : {}),
    ...style
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: merged
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Path data copied verbatim from the Bootstrap Icons SVGs used in admin/html (component guide + samples).
const PATHS = {
  calendar: ['M1 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2zM1 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V7zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V7zM1 12a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2z'],
  search: ['M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'],
  close: ['M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z'],
  refresh: ['M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z', 'M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z'],
  edit: ['M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z', 'M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z'],
  fullscreen: ['M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344 0a.5.5 0 0 1 .707 0l4.096 4.096V11.5a.5.5 0 1 1 1 0v3.975a.5.5 0 0 1-.5.5H11.5a.5.5 0 0 1 0-1h2.768l-4.096-4.096a.5.5 0 0 1 0-.707zm0-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707zm-4.344 0a.5.5 0 0 1-.707 0L1.025 1.732V4.5a.5.5 0 0 1-1 0V.525a.5.5 0 0 1 .5-.5H4.5a.5.5 0 0 1 0 1H1.732l4.096 4.096a.5.5 0 0 1 0 .707z'],
  lineChart: ['M0 0h1v15h15v1H0V0zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5z'],
  barChart: ['M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2z'],
  pieChart: ['M15.985 8.5H8.207l-5.5 5.5a8 8 0 0 0 13.277-5.5zM2 13.292A8 8 0 0 1 7.5.015v7.778l-5.5 5.5zM8.5.015V7.5h7.485A8.001 8.001 0 0 0 8.5.015z'],
  list: ['M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z'],
  caretUp: ['m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z'],
  caretDown: ['M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'],
  caretDownSquare: ['M3.626 6.832A.5.5 0 0 1 4 6h8a.5.5 0 0 1 .374.832l-4 4.5a.5.5 0 0 1-.748 0l-4-4.5z', 'M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2z']
};
const ICON_NAMES = Object.keys(PATHS);
function Icon({
  name,
  size = 16,
  color = 'currentColor',
  style,
  ...rest
}) {
  const d = PATHS[name];
  if (!d) return null;
  return /*#__PURE__*/React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    fill: color,
    viewBox: "0 0 16 16",
    style: {
      display: 'inline-block',
      verticalAlign: 'middle',
      flexShrink: 0,
      ...style
    }
  }, rest), d.map((p, i) => /*#__PURE__*/React.createElement("path", {
    key: i,
    fillRule: "evenodd",
    d: p
  })));
}
Object.assign(__ds_scope, { ICON_NAMES, Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Separator.jsx
try { (() => {
function Separator({
  type = 'hyphen',
  style
}) {
  const s = type === 'bar' ? {
    width: 1,
    height: 10,
    margin: '0 14px',
    background: 'var(--pp-gray-180)'
  } : {
    width: 8,
    height: 1,
    margin: '0 8px',
    background: 'var(--pp-gray-550)'
  };
  return /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: 'inline-block',
      verticalAlign: 'middle',
      flexShrink: 0,
      ...s,
      ...style
    }
  });
}
Object.assign(__ds_scope, { Separator });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Separator.jsx", error: String((e && e.message) || e) }); }

// components/data/DataGrid.jsx
try { (() => {
const {
  useState
} = React; // Recreates the rMateGridH5 "gridStyle" theme from admin/html/_template/_chart/grid00.html
function DataGrid({
  columns = [],
  rows = [],
  height,
  rowHeight = 32,
  headerHeight = 40,
  selectable = true,
  onRowClick,
  style
}) {
  const [hover, setHover] = useState(-1);
  const [sel, setSel] = useState(-1);
  const [sort, setSort] = useState(null);
  const cols = columns.map(c => typeof c === 'string' ? {
    key: c,
    label: c
  } : c);
  let data = rows.map((r, i) => ({
    r,
    i
  }));
  if (sort) data = [...data].sort((a, b) => {
    const x = a.r[sort.key],
      y = b.r[sort.key];
    return (x > y ? 1 : x < y ? -1 : 0) * sort.dir;
  });
  const fmt = v => typeof v === 'number' ? v.toLocaleString('ko-KR') : v;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height,
      overflow: 'auto',
      borderTop: '1px solid var(--pp-navy-300)',
      borderLeft: '1px solid var(--pp-gray-250)',
      borderRight: '1px solid var(--pp-gray-250)',
      borderBottom: '1px solid var(--pp-gray-250)',
      background: '#fff',
      fontFamily: 'var(--font-sans)',
      boxSizing: 'border-box',
      ...style
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: 13,
      color: 'var(--pp-gray-900)'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, cols.map(c => /*#__PURE__*/React.createElement("th", {
    key: c.key,
    onClick: () => setSort(s => ({
      key: c.key,
      dir: s && s.key === c.key ? -s.dir : 1
    })),
    style: {
      position: 'sticky',
      top: 0,
      height: headerHeight,
      padding: '0 8px',
      background: '#fff',
      borderBottom: '1px solid var(--border-grid)',
      borderRight: '1px solid var(--border-grid)',
      fontWeight: 400,
      color: 'var(--text-grid-header)',
      textAlign: 'center',
      whiteSpace: 'nowrap',
      cursor: 'pointer',
      width: c.width
    }
  }, c.label, sort && sort.key === c.key ? sort.dir > 0 ? ' ▲' : ' ▼' : '')))), /*#__PURE__*/React.createElement("tbody", null, data.map(({
    r,
    i
  }, vi) => {
    const bg = sel === i ? 'var(--surface-row-hover)' : hover === i ? 'var(--surface-row-hover)' : vi % 2 === 0 ? 'var(--surface-row-alt)' : '#fff';
    return /*#__PURE__*/React.createElement("tr", {
      key: i,
      onMouseEnter: () => setHover(i),
      onMouseLeave: () => setHover(-1),
      onClick: () => {
        if (selectable) setSel(i);
        onRowClick && onRowClick(r, i);
      },
      style: {
        height: rowHeight,
        background: bg,
        cursor: onRowClick || selectable ? 'pointer' : 'default'
      }
    }, cols.map(c => /*#__PURE__*/React.createElement("td", {
      key: c.key,
      style: {
        padding: '0 8px',
        borderBottom: '1px solid var(--border-grid)',
        borderRight: '1px solid var(--border-grid)',
        textAlign: c.align || 'center',
        verticalAlign: 'middle',
        whiteSpace: 'nowrap'
      }
    }, c.render ? c.render(r[c.key], r) : fmt(r[c.key]))));
  }))));
}
Object.assign(__ds_scope, { DataGrid });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/DataGrid.jsx", error: String((e && e.message) || e) }); }

// components/data/Panel.jsx
try { (() => {
function Panel({
  title,
  titleSize = 'md',
  meta,
  actions,
  children,
  padding = 15,
  fill = false,
  style
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      border: '1px solid var(--border-default)',
      borderRadius: 4,
      padding,
      background: '#fff',
      boxSizing: 'border-box',
      height: fill ? '100%' : 'auto',
      ...style
    }
  }, (title || actions) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      marginBottom: titleSize === 'lg' ? 15 : 10
    }
  }, title && /*#__PURE__*/React.createElement("h6", {
    style: {
      margin: 0,
      fontSize: titleSize === 'lg' ? 18 : 16,
      fontWeight: 700,
      lineHeight: 1.2,
      color: 'var(--pp-gray-900)'
    }
  }, title), meta && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12
    }
  }, meta), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, actions)), children);
}
Object.assign(__ds_scope, { Panel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Panel.jsx", error: String((e && e.message) || e) }); }

// components/data/StatTile.jsx
try { (() => {
function StatTile({
  label,
  value,
  valueSize = 22,
  padding = '20px 10px',
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-tile)',
      padding,
      borderRadius: 4,
      height: '100%',
      boxSizing: 'border-box',
      textAlign: 'center',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 5,
      fontSize: 14,
      fontWeight: 700,
      color: 'var(--bs-secondary)'
    }
  }, label), value !== undefined && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: valueSize,
      fontWeight: 700,
      color: 'var(--bs-dark)',
      lineHeight: 1.2
    }
  }, value), children);
}
Object.assign(__ds_scope, { StatTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatTile.jsx", error: String((e && e.message) || e) }); }

// components/data/StatusCircle.jsx
try { (() => {
const TONES = {
  gray: {
    borderColor: 'var(--pp-gray-100)',
    background: 'var(--pp-gray-280)',
    color: '#6d6d6d'
  },
  dark: {
    borderColor: '#c0c0c0',
    background: 'var(--pp-navy-800)',
    color: '#fff'
  },
  red: {
    borderColor: 'var(--pp-red-200)',
    background: 'var(--pp-red-600)',
    color: '#fff'
  },
  green: {
    borderColor: 'var(--pp-green-200)',
    background: 'var(--pp-green-500)',
    color: '#fff'
  }
};
function StatusCircle({
  tone = 'gray',
  size = 60,
  fontSize = 12,
  bold = false,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: size,
      height: size,
      borderRadius: '50%',
      borderStyle: 'solid',
      borderWidth: 6,
      boxSizing: 'border-box',
      wordBreak: 'break-all',
      textAlign: 'center',
      lineHeight: 1.2,
      fontSize,
      fontWeight: bold ? 700 : 400,
      ...TONES[tone],
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { StatusCircle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatusCircle.jsx", error: String((e && e.message) || e) }); }

// components/data/StepProgress.jsx
try { (() => {
// .circle-step — loan application progress. steps: string[] (use "\n" for the 2-line labels); current: index of the step in progress.
function StepProgress({
  steps = ['서류\n제출', '한도\n산출', '대환\n선택', '본인\n확인', '전자\n약정', '기표\n송금'],
  current = 0,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      width: '100%',
      margin: '5px 0',
      ...style
    }
  }, steps.map((s, i) => {
    const state = i < current ? 'passed' : i === current ? 'now' : 'todo';
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        position: 'relative',
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 0
      }
    }, i > 0 && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        zIndex: -1,
        top: '50%',
        right: '50%',
        width: '100%',
        height: 1,
        background: state === 'todo' ? 'var(--pp-gray-280)' : 'var(--pp-gray-900)'
      }
    }), /*#__PURE__*/React.createElement(__ds_scope.StatusCircle, {
      tone: state === 'passed' ? 'dark' : state === 'now' ? 'red' : 'gray'
    }, s.split('\n').map((l, j) => /*#__PURE__*/React.createElement(React.Fragment, {
      key: j
    }, j > 0 && /*#__PURE__*/React.createElement("br", null), l))));
  }));
}
Object.assign(__ds_scope, { StepProgress });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StepProgress.jsx", error: String((e && e.message) || e) }); }

// components/data/SummaryStat.jsx
try { (() => {
// The "대출실행요약" row: label, count / amount, and a delta with caret (red = up, blue = down).
function SummaryStat({
  label,
  count,
  amount,
  delta,
  trend = 'up',
  style
}) {
  const up = trend === 'up';
  const color = up ? 'var(--bs-danger)' : 'var(--bs-primary)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '30% 70%',
      alignItems: 'start',
      padding: '5px 0 0',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: 'var(--bs-secondary)',
      lineHeight: 1.5
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16
    }
  }, /*#__PURE__*/React.createElement("span", null, count), /*#__PURE__*/React.createElement("span", {
    style: {
      margin: '0 5px'
    }
  }, "/"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 20,
      fontWeight: 700
    }
  }, amount)), delta !== undefined && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: up ? 'caretUp' : 'caretDown',
    color: color
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color
    }
  }, delta))));
}
Object.assign(__ds_scope, { SummaryStat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/SummaryStat.jsx", error: String((e && e.message) || e) }); }

// components/feedback/AlertModal.jsx
try { (() => {
function AlertModal({
  open = true,
  children,
  confirmLabel = '닫기',
  onConfirm,
  cancelLabel,
  onCancel,
  inline = false,
  style
}) {
  if (!open) return null;
  const box = /*#__PURE__*/React.createElement("div", {
    role: "alertdialog",
    "aria-modal": "true",
    style: {
      display: 'flex',
      flexDirection: 'column',
      width: 300,
      minHeight: 222,
      paddingTop: 40,
      background: '#fff',
      borderRadius: 14,
      boxShadow: 'var(--shadow-modal)',
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      color: 'var(--pp-gray-900)',
      boxSizing: 'border-box',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '0 30px',
      whiteSpace: 'normal',
      lineHeight: 1.5
    }
  }, children), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      gap: 10,
      padding: '30px 0'
    }
  }, cancelLabel && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "outline",
    onClick: onCancel
  }, cancelLabel), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    onClick: onConfirm
  }, confirmLabel)));
  if (inline) return box;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 1050,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--backdrop-modal)'
    }
  }, box);
}
Object.assign(__ds_scope, { AlertModal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/AlertModal.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Loading.jsx
try { (() => {
function Loading({
  open = true,
  fixed = true,
  style
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    "aria-label": "\uB85C\uB529\uC911",
    style: {
      position: fixed ? 'fixed' : 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 9000,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'var(--backdrop-loading)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "pp-img-loading"
  }));
}
Object.assign(__ds_scope, { Loading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Loading.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Modal.jsx
try { (() => {
function Modal({
  open = true,
  title,
  children,
  footer,
  onClose,
  width = '90%',
  inline = false,
  style
}) {
  if (!open) return null;
  const dialog = /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    style: {
      display: 'flex',
      flexDirection: 'column',
      minWidth: 800,
      width,
      maxWidth: 1000,
      maxHeight: 'calc(100% - 3.5rem)',
      background: '#fff',
      borderRadius: 14,
      boxShadow: 'var(--shadow-modal)',
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      color: 'var(--pp-gray-900)',
      overflow: 'hidden',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 10px 0 20px',
      borderBottom: '1px solid var(--border-divider)'
    }
  }, /*#__PURE__*/React.createElement("h5", {
    style: {
      margin: 0,
      padding: '5px 0',
      fontSize: 20,
      fontWeight: 700,
      lineHeight: 1.5
    }
  }, title), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "\uB2EB\uAE30",
    onClick: onClose,
    style: {
      minWidth: 40,
      minHeight: 40,
      border: 0,
      background: 'none',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "close",
    size: 14,
    color: "#93949a"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 20px 0',
      overflowY: 'auto',
      flex: 1
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 10,
      padding: '20px 20px 30px'
    }
  }, footer));
  if (inline) return dialog;
  return /*#__PURE__*/React.createElement("div", {
    onClick: e => {
      if (e.target === e.currentTarget && onClose) onClose();
    },
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 1050,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--backdrop-modal)'
    }
  }, dialog);
}
Object.assign(__ds_scope, { Modal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Modal.jsx", error: String((e && e.message) || e) }); }

// components/forms/ChoiceControl.jsx
try { (() => {
const {
  useState
} = React;
function ChoiceControl({
  kind,
  label,
  checked,
  defaultChecked,
  disabled,
  onChange,
  name,
  inline = true,
  style
}) {
  const [inner, setInner] = useState(!!defaultChecked);
  const controlled = checked !== undefined;
  const on = controlled ? checked : inner;
  const toggle = () => {
    if (disabled) return;
    const next = kind === 'radio' ? true : !on;
    if (!controlled) setInner(next);
    onChange && onChange(next);
  };
  const round = kind === 'radio';
  const boxBorder = on ? disabled ? 'var(--pp-navy-500)' : 'var(--pp-navy-800)' : 'var(--pp-gray-350)';
  const boxBg = disabled && !on ? 'var(--pp-gray-150)' : '#fff';
  const img = on ? round ? disabled ? 'pp-img-radio-disabled' : 'pp-img-radio' : disabled ? 'pp-img-checked-disabled' : 'pp-img-checked' : '';
  return /*#__PURE__*/React.createElement("label", {
    role: kind,
    "aria-checked": on,
    "aria-disabled": disabled,
    onClick: e => {
      e.preventDefault();
      toggle();
    },
    style: {
      position: 'relative',
      display: inline ? 'inline-flex' : 'flex',
      alignItems: 'center',
      minHeight: 18,
      paddingLeft: 24,
      marginRight: inline ? 10 : 0,
      fontSize: 12,
      lineHeight: 1.5,
      color: disabled ? 'var(--bs-secondary)' : 'var(--pp-gray-900)',
      cursor: disabled ? 'default' : 'pointer',
      userSelect: 'none',
      verticalAlign: 'middle',
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: kind,
    name: name,
    checked: on,
    disabled: disabled,
    readOnly: true,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 0,
      top: '50%',
      marginTop: -9,
      width: 18,
      height: 18,
      boxSizing: 'border-box',
      border: `1px solid ${boxBorder}`,
      borderRadius: round ? '50%' : 2,
      background: boxBg
    }
  }), on && /*#__PURE__*/React.createElement("span", {
    className: img,
    style: {
      position: 'absolute',
      left: 0,
      top: '50%',
      marginTop: -9,
      width: 18,
      height: 18
    }
  }), label);
}
Object.assign(__ds_scope, { ChoiceControl });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/ChoiceControl.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Checkbox(props) {
  return /*#__PURE__*/React.createElement(__ds_scope.ChoiceControl, _extends({
    kind: "checkbox"
  }, props));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Datepicker.jsx
try { (() => {
const {
  useState
} = React;
const pad = n => String(n).padStart(2, '0');
const fmtDate = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseDate = s => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
  return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
};
const same = (a, b) => a && b && a.toDateString() === b.toDateString();
const DOW = ['일', '월', '화', '수', '목', '금', '토'];
function Datepicker({
  value,
  rangeStart,
  rangeEnd,
  today = new Date(),
  onSelect,
  style
}) {
  const sel = parseDate(value);
  const rs = parseDate(rangeStart),
    re = parseDate(rangeEnd);
  const init = sel || rs || today;
  const [view, setView] = useState(new Date(init.getFullYear(), init.getMonth(), 1));
  const first = new Date(view.getFullYear(), view.getMonth(), 1);
  const start = new Date(first);
  start.setDate(1 - first.getDay());
  const weeks = Array.from({
    length: 6
  }, (_, w) => Array.from({
    length: 7
  }, (_, d) => {
    const x = new Date(start);
    x.setDate(start.getDate() + w * 7 + d);
    return x;
  }));
  const move = n => setView(new Date(view.getFullYear(), view.getMonth() + n, 1));
  const navBtn = {
    width: 30,
    height: 30,
    border: 0,
    background: 'none',
    cursor: 'pointer',
    fontSize: 14,
    color: 'var(--pp-gray-900)',
    borderRadius: 4
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 270,
      padding: 15,
      background: '#fff',
      border: '1px solid rgba(0,0,0,.15)',
      borderRadius: 4,
      fontFamily: 'var(--font-sans)',
      boxSizing: 'border-box',
      ...style
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: navBtn,
    onClick: () => move(-1)
  }, "\xAB")), /*#__PURE__*/React.createElement("th", {
    colSpan: 5,
    style: {
      fontSize: 16,
      fontWeight: 400,
      color: 'var(--pp-gray-900)',
      height: 30
    }
  }, view.getFullYear(), "\uB144 ", view.getMonth() + 1, "\uC6D4"), /*#__PURE__*/React.createElement("th", null, /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: navBtn,
    onClick: () => move(1)
  }, "\xBB"))), /*#__PURE__*/React.createElement("tr", null, DOW.map((d, i) => /*#__PURE__*/React.createElement("th", {
    key: d,
    style: {
      fontSize: 12,
      height: 30,
      paddingBottom: 10,
      fontWeight: 700,
      color: i === 0 ? 'var(--calendar-sunday)' : 'var(--pp-gray-900)'
    }
  }, d)))), /*#__PURE__*/React.createElement("tbody", null, weeks.map((wk, wi) => /*#__PURE__*/React.createElement("tr", {
    key: wi
  }, wk.map((d, di) => {
    const other = d.getMonth() !== view.getMonth();
    const active = same(d, sel) || same(d, rs) || same(d, re);
    const inRange = rs && re && d > rs && d < re;
    const isToday = same(d, today);
    let color = other ? '#999' : di === 0 ? 'var(--calendar-sunday)' : 'var(--pp-gray-900)';
    if (active) color = '#fff';
    return /*#__PURE__*/React.createElement("td", {
      key: di,
      onClick: () => onSelect && onSelect(fmtDate(d)),
      style: {
        position: 'relative',
        width: '14.2%',
        height: 30,
        fontSize: 14,
        color,
        cursor: 'pointer',
        zIndex: 1
      }
    }, inRange && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        zIndex: -1,
        top: 0,
        left: di === 0 ? '20%' : '-5%',
        right: di === 6 ? '20%' : '-5%',
        height: 30,
        background: 'var(--calendar-range)',
        borderRadius: di === 0 ? '15px 0 0 15px' : di === 6 ? '0 15px 15px 0' : 0
      }
    }), (active || isToday) && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        zIndex: -1,
        top: '50%',
        left: '50%',
        width: 30,
        height: 30,
        transform: 'translate(-50%,-50%)',
        borderRadius: '50%',
        boxSizing: 'border-box',
        background: active ? 'var(--calendar-active)' : 'none',
        border: active ? '2px solid var(--calendar-active)' : '1px solid var(--calendar-sunday)'
      }
    }), d.getDate());
  }))))));
}
Object.assign(__ds_scope, { fmtDate, parseDate, Datepicker });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Datepicker.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
const fieldBase = {
  display: 'block',
  width: '100%',
  height: 24,
  padding: '3px 10px',
  border: '1px solid var(--pp-gray-200)',
  borderRadius: 4,
  fontSize: 12,
  lineHeight: 1.5,
  color: 'var(--pp-gray-900)',
  background: '#fff',
  fontFamily: 'var(--font-sans)',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color .15s ease-in-out, box-shadow .15s ease-in-out'
};
function fieldState({
  focus,
  readOnly,
  disabled,
  invalid
}) {
  if (readOnly) return {
    background: 'var(--pp-gray-60)',
    borderColor: 'var(--pp-gray-60)'
  };
  if (disabled) return {
    background: 'var(--pp-gray-60)',
    color: 'var(--pp-gray-300)'
  };
  if (invalid) return {
    borderColor: 'var(--bs-danger)',
    boxShadow: focus ? '0 0 0 .2rem rgba(220,53,69,.25)' : 'none'
  };
  if (focus) return {
    borderColor: 'var(--pp-navy-800)',
    boxShadow: '0 0 0 .2rem rgba(0,123,255,.25)'
  };
  return {};
}
function Input({
  value,
  defaultValue,
  placeholder,
  readOnly,
  disabled,
  invalid,
  clearable,
  align,
  onChange,
  width,
  style,
  inputStyle,
  ...rest
}) {
  const [focus, setFocus] = useState(false);
  const [inner, setInner] = useState(defaultValue ?? '');
  const controlled = value !== undefined;
  const v = controlled ? value : inner;
  const set = e => {
    if (!controlled) setInner(e.target.value);
    onChange && onChange(e);
  };
  const s = {
    ...fieldBase,
    ...fieldState({
      focus,
      readOnly,
      disabled,
      invalid
    }),
    textAlign: align || 'left',
    ...(clearable ? {
      paddingRight: 34
    } : {}),
    ...inputStyle
  };
  const input = /*#__PURE__*/React.createElement("input", _extends({
    className: "pp-field",
    value: v,
    placeholder: placeholder,
    readOnly: readOnly,
    disabled: disabled,
    onChange: set,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: s
  }, rest));
  if (!clearable) return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      width: width ?? (style && style.width) ?? 'auto',
      verticalAlign: 'middle',
      ...style
    }
  }, input);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-block',
      width: width ?? 'auto',
      verticalAlign: 'middle',
      ...style
    }
  }, input, String(v).length > 0 && !readOnly && !disabled && /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "clear",
    className: "pp-img-clear",
    onMouseDown: e => e.preventDefault(),
    onClick: () => set({
      target: {
        value: ''
      }
    }),
    style: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 34,
      height: 24,
      border: 0,
      backgroundColor: 'transparent',
      cursor: 'pointer'
    }
  }));
}
Object.assign(__ds_scope, { fieldBase, fieldState, Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/data/FieldTable.jsx
try { (() => {
// rows: array of rows; each row an array of cells { label, value, span, align, render, labelAlign }
function FieldTable({
  rows = [],
  columns = 4,
  labelWidth,
  valueWidth,
  variant = 'borderless',
  style
}) {
  const lw = labelWidth ?? (columns === 4 ? '10%' : columns === 3 ? '11%' : columns === 2 ? '20%' : '15%');
  const vw = valueWidth ?? (columns === 4 ? '15%' : columns === 3 ? '22.33%' : columns === 2 ? '30%' : '85%');
  const bordered = variant === 'bordered';
  const cellPad = bordered ? 12 : '3px 5px';
  const bd = bordered ? '1px solid var(--border-default)' : 'none';
  return /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      tableLayout: 'fixed',
      fontSize: 12,
      color: 'var(--pp-gray-900)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("colgroup", null, Array.from({
    length: columns
  }).flatMap((_, i) => [/*#__PURE__*/React.createElement("col", {
    key: `l${i}`,
    style: {
      width: lw
    }
  }), /*#__PURE__*/React.createElement("col", {
    key: `v${i}`,
    style: {
      width: vw
    }
  })])), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, ri) => /*#__PURE__*/React.createElement("tr", {
    key: ri
  }, r.flatMap((c, ci) => {
    if (c.raw) return [/*#__PURE__*/React.createElement("td", {
      key: ci,
      colSpan: c.colSpan,
      rowSpan: c.rowSpan,
      style: {
        padding: cellPad,
        border: bd,
        verticalAlign: 'middle'
      }
    }, c.raw)];
    const span = c.span ? c.span * 2 - 1 : 1;
    return [/*#__PURE__*/React.createElement("th", {
      key: `h${ci}`,
      style: {
        padding: cellPad,
        border: bd,
        textAlign: 'left',
        fontWeight: 700,
        color: 'var(--pp-gray-800)',
        lineHeight: 1.2,
        verticalAlign: c.labelAlign || 'middle'
      }
    }, c.label), /*#__PURE__*/React.createElement("td", {
      key: `d${ci}`,
      colSpan: span,
      style: {
        padding: cellPad,
        border: bd,
        verticalAlign: 'middle'
      }
    }, c.render ? c.render : c.label === undefined ? null : /*#__PURE__*/React.createElement(__ds_scope.Input, {
      value: c.value ?? '',
      readOnly: c.editable ? false : true,
      align: c.align,
      style: {
        display: 'block',
        width: '100%'
      },
      onChange: () => {}
    }))];
  })))));
}
Object.assign(__ds_scope, { FieldTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/FieldTable.jsx", error: String((e && e.message) || e) }); }

// components/forms/InputGroup.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function InputGroup({
  icon = 'calendar',
  onAddonClick,
  addon,
  width = 120,
  inputProps = {},
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'stretch',
      verticalAlign: 'middle',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Input, _extends({
    width: width
  }, inputProps, {
    inputStyle: {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      ...(inputProps.inputStyle || {})
    }
  })), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "addon",
    size: "icon",
    onClick: onAddonClick,
    style: {
      marginLeft: -1,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      minWidth: 24
    }
  }, addon || /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16
  })));
}
Object.assign(__ds_scope, { InputGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/InputGroup.jsx", error: String((e && e.message) || e) }); }

// components/forms/DateInput.jsx
try { (() => {
const {
  useState,
  useEffect,
  useRef
} = React;
function useOutside(ref, close) {
  useEffect(() => {
    const h = e => {
      if (ref.current && !ref.current.contains(e.target)) close();
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
}
function DateInput({
  value,
  defaultValue = '',
  placeholder = 'YYYY-MM-DD',
  onChange,
  width = 90,
  rangeStart,
  rangeEnd
}) {
  const [inner, setInner] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOutside(ref, () => setOpen(false));
  const v = value !== undefined ? value : inner;
  const set = s => {
    setInner(s);
    onChange && onChange(s);
  };
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    style: {
      position: 'relative',
      display: 'inline-block',
      verticalAlign: 'middle'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.InputGroup, {
    width: width,
    onAddonClick: () => setOpen(!open),
    inputProps: {
      value: v,
      placeholder,
      onChange: e => set(e.target.value),
      onFocus: () => setOpen(true)
    }
  }), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 'calc(100% + 2px)',
      left: 0,
      zIndex: 1000
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Datepicker, {
    value: rangeStart || rangeEnd ? undefined : v,
    rangeStart: rangeStart,
    rangeEnd: rangeEnd,
    onSelect: s => {
      set(s);
      setOpen(false);
    }
  })));
}
Object.assign(__ds_scope, { DateInput });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/DateInput.jsx", error: String((e && e.message) || e) }); }

// components/forms/DateRange.jsx
try { (() => {
const {
  useState
} = React;
function DateRange({
  start,
  end,
  defaultStart = '',
  defaultEnd = '',
  onChange,
  width = 90
}) {
  const [s, setS] = useState(defaultStart);
  const [e, setE] = useState(defaultEnd);
  const vs = start !== undefined ? start : s;
  const ve = end !== undefined ? end : e;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.DateInput, {
    width: width,
    value: vs,
    rangeStart: vs,
    rangeEnd: ve,
    onChange: x => {
      setS(x);
      onChange && onChange(x, ve);
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Separator, {
    type: "hyphen"
  }), /*#__PURE__*/React.createElement(__ds_scope.DateInput, {
    width: width,
    value: ve,
    rangeStart: vs,
    rangeEnd: ve,
    onChange: x => {
      setE(x);
      onChange && onChange(vs, x);
    }
  }));
}
Object.assign(__ds_scope, { DateRange });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/DateRange.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
function Radio(props) {
  return /*#__PURE__*/React.createElement(__ds_scope.ChoiceControl, _extends({
    kind: "radio"
  }, props));
}
function RadioGroup({
  name,
  options = [],
  value,
  defaultValue,
  onChange,
  disabled
}) {
  const [inner, setInner] = useState(defaultValue);
  const cur = value !== undefined ? value : inner;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, options.map(o => {
    const opt = typeof o === 'string' ? {
      value: o,
      label: o
    } : o;
    return /*#__PURE__*/React.createElement(__ds_scope.ChoiceControl, {
      key: opt.value,
      kind: "radio",
      name: name,
      label: opt.label,
      checked: cur === opt.value,
      disabled: disabled || opt.disabled,
      onChange: () => {
        setInner(opt.value);
        onChange && onChange(opt.value);
      }
    });
  }));
}
Object.assign(__ds_scope, { Radio, RadioGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/SearchBar.jsx
try { (() => {
const {
  useState
} = React;
// The grey search/filter bar (.bg-info.rounded-lg) with optional collapsible 상세검색 row.
function SearchBar({
  children,
  actions,
  detail,
  defaultExpanded = false,
  detailLabel = '상세검색',
  style
}) {
  const [open, setOpen] = useState(defaultExpanded);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 30px',
      background: 'var(--surface-filter)',
      borderRadius: 4.8,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 10,
      marginRight: 'auto'
    }
  }, children), actions, detail && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "ghost",
    onClick: () => setOpen(!open),
    style: {
      gap: 4
    }
  }, detailLabel, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "caretDownSquare",
    style: {
      transform: open ? 'rotate(180deg)' : 'none'
    }
  }))), detail && open && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 10,
      paddingTop: 10
    }
  }, detail));
}
Object.assign(__ds_scope, { SearchBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SearchBar.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
function Select({
  options = [],
  value,
  defaultValue,
  onChange,
  disabled,
  width,
  style,
  ...rest
}) {
  const [focus, setFocus] = useState(false);
  const opts = options.map(o => typeof o === 'string' ? {
    value: o,
    label: o
  } : o);
  return /*#__PURE__*/React.createElement("select", _extends({
    className: "pp-field",
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      ...__ds_scope.fieldBase,
      display: 'inline-block',
      width: width ?? 'auto',
      padding: '0 6px',
      verticalAlign: 'middle',
      ...__ds_scope.fieldState({
        focus,
        disabled
      }),
      ...style
    }
  }, rest), opts.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label)));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
function Textarea({
  rows = 3,
  value,
  defaultValue,
  placeholder,
  readOnly,
  disabled,
  onChange,
  style,
  ...rest
}) {
  const [focus, setFocus] = useState(false);
  return /*#__PURE__*/React.createElement("textarea", _extends({
    className: "pp-field",
    rows: rows,
    value: value,
    defaultValue: defaultValue,
    placeholder: placeholder,
    readOnly: readOnly,
    disabled: disabled,
    onChange: onChange,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      ...__ds_scope.fieldBase,
      height: 'auto',
      resize: 'vertical',
      ...__ds_scope.fieldState({
        focus,
        readOnly,
        disabled
      }),
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/navigation/AppHeader.jsx
try { (() => {
const {
  useState
} = React;
const DEFAULT_MENU = ['회원', '여신', '수신', '고객지원', '마케팅', '설정', '보고서', '시스템'];
function HeaderSelect({
  options,
  lg
}) {
  return /*#__PURE__*/React.createElement("select", {
    className: "pp-img-select-arrow",
    style: {
      WebkitAppearance: 'none',
      appearance: 'none',
      display: 'inline-block',
      minWidth: lg ? 180 : 140,
      height: 28,
      padding: '0 30px 0 15px',
      border: 'none',
      outline: 'none',
      borderRadius: 5,
      backgroundColor: 'var(--pp-navy-700)',
      fontSize: 12,
      color: '#fff',
      fontFamily: 'var(--font-sans)',
      verticalAlign: 'middle'
    }
  }, options.map((o, i) => /*#__PURE__*/React.createElement("option", {
    key: i,
    style: {
      background: 'var(--pp-navy-700)',
      color: '#fff',
      fontSize: 13
    }
  }, o)));
}
function AppHeader({
  menu = DEFAULT_MENU,
  active,
  onNavigate,
  userName = '홍길동',
  userPosition = '계장',
  lastLogin = '최종 로그인 정보 2021-03-02 12:01:34 (172.10.10.10)',
  shortcuts = ['바로가기'],
  history = ['메뉴이력'],
  onLogout,
  fixed = false,
  style
}) {
  const [hover, setHover] = useState(null);
  const cur = active ?? menu[0];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: fixed ? 'fixed' : 'relative',
      top: 0,
      left: 0,
      zIndex: 600,
      width: '100%',
      minWidth: fixed ? 1860 : 0,
      height: 50,
      background: 'var(--pp-navy-800)',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 30,
      height: '100%',
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      lineHeight: 0
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    "aria-label": "\uD398\uD37C\uC800\uCD95\uC740\uD589 \uAD00\uB9AC\uC790",
    className: "pp-img-header-logo"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      marginLeft: 11,
      fontSize: 13,
      fontWeight: 700,
      color: '#fff',
      lineHeight: 1.5
    }
  }, "Admin", /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: -1,
      width: 'calc(100% + 2px)',
      height: 2,
      background: 'var(--pp-navy-50)'
    }
  }))), /*#__PURE__*/React.createElement("ul", {
    style: {
      display: 'flex',
      height: 50,
      margin: 0,
      padding: '0 0 0 282px',
      listStyle: 'none'
    }
  }, menu.map(m => {
    const on = m === cur || hover === m;
    return /*#__PURE__*/React.createElement("li", {
      key: m,
      style: {
        height: '100%'
      }
    }, /*#__PURE__*/React.createElement("a", {
      href: "#",
      onMouseEnter: () => setHover(m),
      onMouseLeave: () => setHover(null),
      onClick: e => {
        e.preventDefault();
        onNavigate && onNavigate(m);
      },
      style: {
        position: 'relative',
        display: 'block',
        padding: 15,
        fontSize: 14,
        fontWeight: 700,
        color: '#fff',
        lineHeight: 1.5,
        textDecoration: 'none'
      }
    }, m, on && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        bottom: 14,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 30px)',
        height: 2,
        background: '#fff'
      }
    })));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      right: 30,
      height: '100%',
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(HeaderSelect, {
    options: shortcuts
  }), /*#__PURE__*/React.createElement(HeaderSelect, {
    options: history,
    lg: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      marginLeft: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "pp-img-profile",
    style: {
      display: 'inline-block',
      width: 28,
      height: 28
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 3,
      fontSize: 14,
      fontWeight: 700,
      color: '#fff'
    }
  }, userName, /*#__PURE__*/React.createElement("span", {
    style: {
      paddingLeft: 5
    }
  }, userPosition)), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 16,
      fontSize: 12,
      color: 'var(--pp-gray-450)'
    }
  }, lastLogin)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onLogout,
    style: {
      height: 28,
      lineHeight: '26px',
      marginLeft: 14,
      padding: '0 16px',
      border: 0,
      borderRadius: 25,
      background: 'var(--pp-navy-700)',
      fontSize: 13,
      color: '#fff',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)'
    }
  }, "Logout"))));
}
Object.assign(__ds_scope, { AppHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/AppHeader.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Pills.jsx
try { (() => {
const {
  useState
} = React;
function Pills({
  items = [],
  value,
  defaultValue,
  onChange,
  size = 'md',
  style
}) {
  const [inner, setInner] = useState(defaultValue ?? (items[0] && (items[0].value ?? items[0])));
  const cur = value !== undefined ? value : inner;
  const sm = size === 'sm';
  const list = items.map(it => typeof it === 'string' ? {
    value: it,
    label: it
  } : it);
  return /*#__PURE__*/React.createElement("ul", {
    role: "tablist",
    style: {
      display: 'inline-flex',
      margin: 0,
      padding: 0,
      listStyle: 'none',
      overflow: 'hidden',
      verticalAlign: 'middle',
      ...style
    }
  }, list.map((it, i) => {
    const on = it.value === cur;
    const first = i === 0,
      last = i === list.length - 1;
    const nextOn = list[i + 1] && list[i + 1].value === cur;
    return /*#__PURE__*/React.createElement("li", {
      key: it.value,
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("a", {
      role: "tab",
      "aria-selected": on,
      href: "#",
      onClick: e => {
        e.preventDefault();
        setInner(it.value);
        onChange && onChange(it.value);
      },
      style: {
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        minWidth: sm ? 40 : 90,
        minHeight: sm ? 20 : 'auto',
        padding: sm ? '2px 12px' : '2px 15px',
        fontSize: 12,
        lineHeight: 1.5,
        textAlign: 'center',
        textDecoration: 'none',
        cursor: 'pointer',
        borderTop: `1px solid ${on ? 'var(--pp-navy-800)' : 'var(--pp-gray-350)'}`,
        borderBottom: `1px solid ${on ? 'var(--pp-navy-800)' : 'var(--pp-gray-350)'}`,
        borderLeft: first ? `1px solid ${on ? 'var(--pp-navy-800)' : 'var(--pp-gray-350)'}` : 'none',
        borderRight: last ? `1px solid ${on ? 'var(--pp-navy-800)' : 'var(--pp-gray-350)'}` : 'none',
        borderRadius: first && last ? 4 : first ? '4px 0 0 4px' : last ? '0 4px 4px 0' : 0,
        background: on ? 'var(--pp-navy-800)' : '#fff',
        color: on ? '#fff' : 'var(--pp-gray-700)',
        fontWeight: on ? 700 : 400
      }
    }, it.label), !last && !on && !nextOn && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        zIndex: 2,
        top: '50%',
        right: 0,
        marginTop: -4,
        width: 1,
        height: 8,
        background: 'var(--pp-gray-350)'
      }
    }));
  }));
}
Object.assign(__ds_scope, { Pills });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Pills.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
const {
  useState
} = React;
function Tabs({
  items = [],
  value,
  defaultValue,
  onChange,
  size = 'md',
  fill = false,
  style
}) {
  const list = items.map(it => typeof it === 'string' ? {
    value: it,
    label: it
  } : it);
  const [inner, setInner] = useState(defaultValue ?? (list[0] && list[0].value));
  const cur = value !== undefined ? value : inner;
  const lg = size === 'lg';
  return /*#__PURE__*/React.createElement("ul", {
    role: "tablist",
    style: {
      display: 'flex',
      margin: 0,
      padding: 0,
      listStyle: 'none',
      borderBottom: '1px solid var(--pp-navy-800)',
      ...style
    }
  }, list.map(it => {
    const on = it.value === cur;
    return /*#__PURE__*/React.createElement("li", {
      key: it.value,
      style: {
        marginBottom: -1,
        flex: fill ? 1 : 'none'
      }
    }, /*#__PURE__*/React.createElement("a", {
      role: "tab",
      "aria-selected": on,
      href: "#",
      onClick: e => {
        e.preventDefault();
        setInner(it.value);
        onChange && onChange(it.value);
      },
      style: {
        display: 'block',
        boxSizing: 'border-box',
        minWidth: lg ? 0 : 110,
        height: lg ? 40 : 'auto',
        lineHeight: lg ? '38px' : 1.5,
        padding: lg ? 0 : '4px 15px',
        fontSize: lg ? 15 : 13,
        textAlign: 'center',
        textDecoration: 'none',
        cursor: 'pointer',
        border: '1px solid transparent',
        borderColor: on ? 'var(--pp-navy-800) var(--pp-navy-800) #fff' : 'transparent',
        background: on ? '#fff' : 'var(--pp-gray-60)',
        color: on ? 'var(--pp-gray-900)' : 'var(--pp-gray-700)',
        fontWeight: on ? 700 : 400
      }
    }, it.label));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Lnb.jsx
try { (() => {
const {
  useState
} = React;
function smallBtn(extra) {
  return {
    height: 34,
    lineHeight: '32px',
    padding: '0 20px',
    border: '1px solid var(--pp-gray-350)',
    borderRadius: 5,
    background: '#fff',
    fontSize: 14,
    color: 'var(--pp-gray-700)',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    boxSizing: 'border-box',
    ...extra
  };
}
function Node({
  node,
  depth,
  isLast,
  path,
  openMap,
  toggle,
  activeId,
  onSelect
}) {
  const id = path;
  const hasKids = node.children && node.children.length > 0;
  const open = openMap[id] ?? !!node.open;
  const on = activeId === (node.id ?? id);
  const pb = depth === 1 ? isLast ? 0 : 20 : isLast && depth > 2 ? 0 : 10;
  return /*#__PURE__*/React.createElement("li", {
    style: {
      position: 'relative',
      listStyle: 'none',
      paddingBottom: pb
    }
  }, !isLast && /*#__PURE__*/React.createElement("span", {
    className: "pp-img-lnb-vdot",
    style: {
      position: 'absolute',
      zIndex: 1,
      top: 10,
      left: 0,
      width: 16,
      height: '100%'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start'
    }
  }, hasKids && /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": open ? '닫기' : '열기',
    className: open ? 'pp-img-lnb-minus' : 'pp-img-lnb-plus',
    onClick: () => toggle(id, !open),
    style: {
      position: 'relative',
      zIndex: 10,
      width: 16,
      height: 16,
      border: 0,
      padding: 0,
      marginTop: 2,
      cursor: 'pointer',
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onSelect && onSelect(node.id ?? id, node);
      if (hasKids) toggle(id, !open);
    },
    style: {
      position: 'relative',
      display: 'inline-block',
      top: 1,
      marginLeft: hasKids ? 0 : 9.5,
      paddingLeft: 10,
      fontSize: 14,
      lineHeight: 1.5,
      color: 'var(--pp-gray-900)',
      textDecoration: on ? 'underline' : 'none',
      fontWeight: on ? 700 : 400
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "pp-img-lnb-hdot",
    style: {
      position: 'absolute',
      top: 0,
      left: -1.5,
      width: 10,
      height: '100%'
    }
  }), node.label)), hasKids && open && /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      padding: depth === 1 ? '15px 0 4px 26px' : '15px 0 0 26px',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "pp-img-lnb-vdot",
    style: {
      position: 'absolute',
      zIndex: 1,
      top: -2,
      left: 26,
      width: 16,
      height: 17
    }
  }), node.children.map((c, i) => /*#__PURE__*/React.createElement(Node, {
    key: i,
    node: c,
    depth: depth + 1,
    isLast: i === node.children.length - 1,
    path: `${path}.${i}`,
    openMap: openMap,
    toggle: toggle,
    activeId: activeId,
    onSelect: onSelect
  }))));
}
function Lnb({
  tree = [],
  tabs = ['입력결과', '즐겨찾기'],
  activeId,
  onSelect,
  open: openProp,
  defaultOpen = true,
  onToggleOpen,
  height = '100%',
  style
}) {
  const [openInner, setOpenInner] = useState(defaultOpen);
  const isOpen = openProp !== undefined ? openProp : openInner;
  const [openMap, setOpenMap] = useState({});
  const [q, setQ] = useState('');
  const toggle = (id, v) => setOpenMap(m => ({
    ...m,
    [id]: v
  }));
  const setAll = v => {
    const m = {};
    const walk = (ns, p) => ns.forEach((n, i) => {
      const id = p ? `${p}.${i}` : String(i);
      if (n.children) {
        m[id] = v;
        walk(n.children, id);
      }
    });
    walk(tree, '');
    setOpenMap(m);
  };
  const flip = () => {
    setOpenInner(!isOpen);
    onToggleOpen && onToggleOpen(!isOpen);
  };
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      position: 'relative',
      height,
      background: '#fff',
      fontFamily: 'var(--font-sans)',
      zIndex: 500,
      flexShrink: 0,
      ...style
    }
  }, isOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      overflowY: 'auto',
      width: 282,
      height: '100%',
      padding: '0 30px',
      boxSizing: 'border-box',
      borderRight: '1px solid var(--pp-navy-300)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Tabs, {
    items: tabs,
    size: "lg",
    fill: true,
    style: {
      paddingTop: 20
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 0 20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: q,
    onChange: e => setQ(e.target.value),
    style: {
      width: 'calc(100% - 75px)',
      height: 34,
      padding: '0 10px',
      border: '1px solid var(--pp-gray-350)',
      borderRadius: 5,
      fontSize: 14,
      color: 'var(--pp-gray-900)',
      outline: 'none',
      boxSizing: 'border-box',
      fontFamily: 'var(--font-sans)'
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: smallBtn({
      width: 65,
      marginLeft: 10,
      padding: '0 10px'
    })
  }, "\uAC80\uC0C9")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: smallBtn(),
    onClick: () => setAll(false)
  }, "\uC804\uCCB4\uB2EB\uAE30"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: smallBtn(),
    onClick: () => setAll(true)
  }, "\uC804\uCCB4\uC5F4\uAE30")), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      padding: '20px 0 0'
    }
  }, tree.map((n, i) => /*#__PURE__*/React.createElement(Node, {
    key: i,
    node: n,
    depth: 1,
    isLast: i === tree.length - 1,
    path: String(i),
    openMap: openMap,
    toggle: toggle,
    activeId: activeId,
    onSelect: onSelect
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: -23,
      top: '50%',
      width: 24,
      height: 54,
      marginTop: -27,
      border: '1px solid var(--pp-navy-300)',
      borderLeft: 'none',
      borderRadius: '0 2px 2px 0',
      background: '#fff',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "\uBA54\uB274 \uC5F4\uAE30/\uB2EB\uAE30",
    className: "pp-img-lnb-arrow",
    onClick: flip,
    style: {
      width: 23,
      height: 52,
      border: 0,
      padding: 0,
      cursor: 'pointer',
      transform: isOpen ? 'rotate(180deg)' : 'none'
    }
  })));
}
Object.assign(__ds_scope, { Lnb });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Lnb.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/ApplicationListScreen.jsx
try { (() => {
const DS_L = window.PepperDigitalAdminDesignSystem_0682d9;
const APPS = [['P210302000100', '나여신', '010-9999-1234', '페퍼다이렉트', '토스', 35000000, '한도산출', '진행중'], ['P210302000101', '김페퍼', '010-1234-0001', '페퍼다이렉트', '토스', 12000000, '전자약정', '승인'], ['P210302000102', '이디지', '010-5555-7777', '페퍼다이렉트', '자사앱', 5000000, '서류제출', '중단'], ['P210302000103', '박저축', '010-2222-3333', '페퍼다이렉트', '토스', 20000000, '기표송금', '대출실행'], ['P210302000104', '최대환', '010-8888-4444', '페퍼다이렉트', '자사앱', 8000000, '대환선택', '진행중'], ['P210302000105', '정한도', '010-3333-9999', '페퍼다이렉트', '토스', 15000000, '본인확인', '진행중']].map(([no, nm, ph, pd, ch, amt, step, st]) => ({
  no,
  nm,
  ph,
  pd,
  ch,
  amt,
  step,
  st,
  dt: '2021-03-02'
}));
function ApplicationListScreen({
  onRow
}) {
  const {
    SearchBar,
    Select,
    DateRange,
    Separator,
    Button,
    Input,
    Checkbox,
    DataGrid
  } = DS_L;
  const [q, setQ] = React.useState('');
  const rows = APPS.filter(r => !q || r.nm.includes(q) || r.ph.includes(q));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageTitle, null, "\uB300\uCD9C\uC2E0\uCCAD\uAD00\uB9AC"), /*#__PURE__*/React.createElement(SearchBar, {
    style: {
      marginBottom: 20
    },
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "success-outline"
    }, "Excel"), /*#__PURE__*/React.createElement(Button, {
      variant: "danger"
    }, "\uC870\uD68C")),
    defaultExpanded: true,
    detail: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Input, {
      placeholder: "\uACE0\uAC1D\uBA85",
      value: q,
      onChange: e => setQ(e.target.value)
    }), /*#__PURE__*/React.createElement(Input, {
      placeholder: "\uD734\uB300\uD3F0"
    }), /*#__PURE__*/React.createElement(Input, {
      placeholder: "\uC0DD\uB144\uC6D4\uC77C"
    }), /*#__PURE__*/React.createElement(Input, {
      placeholder: "\uC2E0\uCCAD\uBC88\uD638"
    }), /*#__PURE__*/React.createElement(Select, {
      options: ['금액구분']
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Input, {
      placeholder: "0",
      width: 100
    }), /*#__PURE__*/React.createElement(Separator, null), /*#__PURE__*/React.createElement(Input, {
      placeholder: "50,000,000",
      width: 100
    })), ['한도산출', '대환선택', '본인확인', '전자약정', '기표송금출'].map(l => /*#__PURE__*/React.createElement(Checkbox, {
      key: l,
      label: l,
      defaultChecked: true
    })))
  }, /*#__PURE__*/React.createElement(Select, {
    options: ['전체']
  }), /*#__PURE__*/React.createElement(DateRange, {
    defaultStart: "2021-03-02",
    defaultEnd: "2021-03-02"
  }), /*#__PURE__*/React.createElement(Select, {
    options: ['기간', '오늘', '1주일', '1개월']
  }), /*#__PURE__*/React.createElement(Separator, {
    type: "bar"
  }), /*#__PURE__*/React.createElement(Select, {
    options: ['상품구분']
  }), /*#__PURE__*/React.createElement(Select, {
    options: ['유입채널']
  }), /*#__PURE__*/React.createElement(Select, {
    options: ['진행상태']
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("span", null, "\uCD1D ", /*#__PURE__*/React.createElement("b", null, rows.length), "\uAC74")), /*#__PURE__*/React.createElement(DataGrid, {
    height: 420,
    onRowClick: onRow,
    columns: [{
      key: 'no',
      label: '신청번호'
    }, {
      key: 'dt',
      label: '신청일자'
    }, {
      key: 'nm',
      label: '고객명'
    }, {
      key: 'ph',
      label: '휴대폰'
    }, {
      key: 'pd',
      label: '상품명'
    }, {
      key: 'ch',
      label: '유입채널'
    }, {
      key: 'amt',
      label: '신청금액',
      align: 'right'
    }, {
      key: 'step',
      label: '최종진행단계'
    }, {
      key: 'st',
      label: '진행상태'
    }],
    rows: rows
  }));
}
window.ApplicationListScreen = ApplicationListScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/ApplicationListScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/CustomerScreen.jsx
try { (() => {
const DS_C = window.PepperDigitalAdminDesignSystem_0682d9;
function CustomerScreen({
  onOpenModal
}) {
  const {
    Input,
    Button,
    Panel,
    FieldTable,
    Pills,
    Tabs,
    Checkbox,
    Select,
    RadioGroup,
    DateInput,
    DateRange,
    Textarea,
    StepProgress,
    DataGrid
  } = DS_C;
  const [cti, setCti] = React.useState('대기');
  const [loanTab, setLoanTab] = React.useState('여신');
  const sel = o => /*#__PURE__*/React.createElement(Select, {
    options: o,
    style: {
      width: '100%'
    }
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: 20,
      padding: '10px 30px',
      background: '#f5f5f5',
      borderRadius: 4.8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    width: 375,
    placeholder: "\uC870\uD68C\uD558\uB824\uB294 \uC2E0\uCCAD \uAC74\uC758 \uAC80\uC0C9\uC5B4(\uACE0\uAC1D\uBA85/\uD734\uB300\uD3F0/\uC0C1\uB2F4\uBC88\uD638)\uB97C \uC785\uB825\uD558\uC138\uC694.",
    style: {
      marginRight: 10
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "danger",
    style: {
      marginRight: 15
    }
  }, "\uC870\uD68C"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginRight: 5
    }
  }, "\uBC1C\uC2E0\uBC88\uD638"), /*#__PURE__*/React.createElement("b", {
    style: {
      fontSize: 14
    }
  }, "010-9999-1234")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(Button, {
    style: {
      marginRight: 1
    }
  }, "CTI \uB85C\uADF8\uC778"), ['대기', '통화 중', '후처리', '휴식', '업무', '끊기'].map(b => /*#__PURE__*/React.createElement(Button, {
    key: b,
    variant: "outline",
    onClick: () => setCti(b),
    style: cti === b ? {
      borderColor: '#2d2f3a',
      color: '#2d2f3a'
    } : null
  }, b)), /*#__PURE__*/React.createElement(Input, {
    placeholder: "\uC804\uD654\uBC88\uD638",
    width: 110,
    style: {
      margin: '0 16px'
    }
  }), ['전화걸기', '당겨받기', '돌려주기', '돌린전화끊기', '욕설비하 ARS'].map(b => /*#__PURE__*/React.createElement(Button, {
    key: b,
    variant: "outline"
  }, b)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 10,
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      marginBottom: 5
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 18,
      fontWeight: 700
    }
  }, "\uB098\uC5EC\uC2E0"), /*#__PURE__*/React.createElement("span", null, "( \uB0A8\uC131, \uAC1C\uC778, \uB9CC 32\uC138 )"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      gap: 4
    }
  }, ['유', '신', '회', '파', '연', '건', '특', 'F'].map(x => /*#__PURE__*/React.createElement(Button, {
    key: x,
    size: "sm",
    variant: "outline"
  }, x)))), /*#__PURE__*/React.createElement(FieldTable, {
    style: {
      marginBottom: 10
    },
    rows: [[{
      label: '고객번호',
      value: '328-01234567'
    }, {
      label: '고객상태',
      value: '정상'
    }, {
      label: '생년월일',
      value: '1988-06-21'
    }, {
      label: '직업',
      value: '급여소득자'
    }], [{
      label: '휴대폰',
      value: '010-9999-1234'
    }, {
      label: '문자수신',
      value: '수신'
    }, {
      label: '직장명',
      value: '(주)페퍼저축은행'
    }, {
      label: '근무상태',
      value: '근무'
    }], [{
      label: '자택주소',
      value: '경기도 성남시 황새울로 12345',
      span: 2
    }, {
      label: '자택전화',
      value: '032-1234-5678'
    }, {
      label: '이메일',
      value: 'abc@daum.net'
    }], [{
      label: '회원구분',
      value: '금융회원'
    }, {
      label: '가입일자',
      value: '2021-03-02'
    }, {
      label: '단말정보',
      value: 'iOS 14.4.1'
    }, {
      label: '바이오인증',
      value: '지문'
    }], [{
      label: '회원상태',
      value: '정상'
    }, {
      label: '최종접속일시',
      value: '2021-03-03 10:42:29'
    }, {
      label: '알림수신',
      value: '수신'
    }, {
      label: '광고수신',
      value: '수신'
    }]]
  })), /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(Pills, {
    items: ['여신', '수신'],
    value: loanTab,
    onChange: setLoanTab,
    style: {
      marginRight: 20
    }
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "\uD574\uC9C0/\uC644\uC81C\uACC4\uC88C \uD3EC\uD568"
  })), /*#__PURE__*/React.createElement(DataGrid, {
    height: 117,
    style: {
      marginBottom: 5
    },
    columns: [{
      key: 'acc',
      label: '계좌번호'
    }, {
      key: 'pd',
      label: '상품명'
    }, {
      key: 'st',
      label: '상태'
    }, {
      key: 'bal',
      label: '대출잔액',
      align: 'right'
    }, {
      key: 'rt',
      label: '금리'
    }],
    rows: loanTab === '여신' ? [{
      acc: '327-77-99-1234567',
      pd: '페퍼다이렉트',
      st: '정상',
      bal: 35000000,
      rt: '12.5%'
    }, {
      acc: '327-77-99-7654321',
      pd: '페퍼다이렉트',
      st: '완제',
      bal: 0,
      rt: '14.9%'
    }] : [{
      acc: '328-11-22-0001234',
      pd: '정기예금',
      st: '정상',
      bal: 10000000,
      rt: '2.1%'
    }]
  }), /*#__PURE__*/React.createElement(FieldTable, {
    style: {
      marginBottom: 10
    },
    rows: [[{
      label: '계좌번호',
      value: '327-77-99-1234567'
    }, {
      label: '상품명',
      value: '페퍼다이렉트'
    }, {
      label: '상태',
      value: '정상'
    }, {
      label: '관리점',
      value: '디지털뱅킹사업본부'
    }], [{
      label: '대출잔액',
      value: '35,000,000',
      align: 'right'
    }, {
      label: '금리',
      value: '12.5%',
      align: 'right'
    }, {
      label: '담보신용구분',
      value: '신용'
    }, {
      label: '자금구분',
      value: '가계자금'
    }], [{
      label: '대출금액',
      value: '35,000,000',
      align: 'right'
    }, {
      label: '상환방식',
      value: '원리금상환'
    }, {
      label: '만기일자',
      value: '2024-03-03'
    }, {
      label: '대출기간',
      value: '36개월'
    }]]
  }), /*#__PURE__*/React.createElement(Tabs, {
    items: ['조회결과', '신용정보', '채무현황', 'CSS정보', '이력조회'],
    style: {
      marginBottom: 5
    }
  }), /*#__PURE__*/React.createElement(FieldTable, {
    rows: [[{
      label: '실행일자',
      value: '2021-03-03'
    }, {
      label: '개설점',
      value: ''
    }, {
      label: '최종이수일',
      value: ''
    }, {
      label: '차기납입일',
      value: ''
    }], [{
      label: '중도수수료율',
      value: '36개월이내 상환 시 2.0%',
      span: 2
    }, {
      label: '연체이율',
      value: '약정이자율+3.0%'
    }, {
      label: '기한이익상실일',
      value: ''
    }], [{
      label: 'CMS은행',
      value: '우리'
    }, {
      label: 'CMS계좌번호',
      value: '1234567890'
    }, {
      label: '예금주명',
      value: '나여신'
    }, {
      label: '가상계좌번호',
      value: '1234567890'
    }]]
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 10,
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(Pills, {
    items: ['대출신청', '간편한도조회', '계좌개설'],
    style: {
      marginRight: 20
    }
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "\uC885\uB8CC\uAC74 \uD3EC\uD568",
    defaultChecked: true
  })), /*#__PURE__*/React.createElement(DataGrid, {
    height: 117,
    style: {
      marginBottom: 10
    },
    columns: [{
      key: 'no',
      label: '신청번호'
    }, {
      key: 'dt',
      label: '신청일자'
    }, {
      key: 'ch',
      label: '유입채널'
    }, {
      key: 'amt',
      label: '신청금액',
      align: 'right'
    }, {
      key: 'st',
      label: '진행상태'
    }],
    rows: [{
      no: 'P210302000100',
      dt: '2021-03-02',
      ch: '토스',
      amt: 35000000,
      st: '진행중'
    }, {
      no: 'P210115000042',
      dt: '2021-01-15',
      ch: '자사앱',
      amt: 10000000,
      st: '중단'
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    onClick: onOpenModal
  }, "\uB300\uCD9C\uC2E0\uCCAD \uC0C1\uC138\uC815\uBCF4")), /*#__PURE__*/React.createElement(FieldTable, {
    rows: [[{
      label: '신청번호',
      value: 'P210302000100'
    }, {
      label: '상품명',
      value: ''
    }, {
      label: '신청일자',
      value: '2021-03-02'
    }, {
      label: '유입방식',
      value: '플랫폼연계'
    }], [{
      label: '진행상태',
      value: '진행중'
    }, {
      label: '최종진행단계',
      value: '한도산출'
    }, {
      label: '최종저장일시',
      value: '2021-03-02 15:26:01'
    }, {
      label: '유입채널',
      value: '토스'
    }], [{
      raw: /*#__PURE__*/React.createElement(StepProgress, {
        current: 3
      }),
      colSpan: 6,
      rowSpan: 2
    }, {
      label: '상환방식',
      value: '원리금균등'
    }], [{
      label: '승인구분',
      value: '승인'
    }], [{
      label: '신청금액',
      value: '35,000,000',
      align: 'right',
      span: 2
    }, {
      label: '중단사유',
      value: '고객 이탈',
      span: 2
    }], [{
      label: '승인금액',
      value: '35,000,000',
      align: 'right',
      span: 2
    }, {
      label: '거절사유',
      value: '',
      span: 2
    }]]
  })), /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(Pills, {
    items: ['상담등록', '고객혜택등록', '유의고객등록', '알림발송'],
    defaultValue: "\uC0C1\uB2F4\uB4F1\uB85D",
    style: {
      marginRight: 'auto'
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "outline"
  }, "\uC548\uB0B4\uC2A4\uD06C\uB9BD\uD2B8"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline"
  }, "\uB300\uCD9C\uC870\uAC74\uD45C")), /*#__PURE__*/React.createElement(FieldTable, {
    style: {
      marginBottom: 10
    },
    rows: [[{
      label: '발신번호',
      value: ''
    }, {
      label: '상담업무구분',
      render: sel(['대출상담', '상환문의'])
    }, {
      label: '유입방법',
      render: sel(['인바운드', '아웃바운드'])
    }, {
      label: '고객만족도',
      render: sel(['보통', '만족', '불만'])
    }], [{
      label: '후속처리',
      render: /*#__PURE__*/React.createElement(RadioGroup, {
        name: "follow",
        options: ['없음', '요청'],
        defaultValue: "\uC5C6\uC74C"
      })
    }, {
      label: '요청상세구분',
      render: sel(['option01'])
    }, {
      label: '처리요망기한',
      render: /*#__PURE__*/React.createElement(DateInput, {
        defaultValue: "2021-03-02",
        width: 80
      })
    }, {
      label: '상담자',
      value: '홍길동'
    }], [{
      label: '상담메모',
      labelAlign: 'top',
      span: 4,
      render: /*#__PURE__*/React.createElement(Textarea, {
        rows: 3
      })
    }]]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: 15
    }
  }, /*#__PURE__*/React.createElement("p", null, "* \uC5EC\uAE30\uC5D0 \uC0C1\uB2F4\uB4F1\uB85D \uAD00\uB828 \uBA54\uC138\uC9C0\uB97C \uD45C\uC2DC\uD569\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline"
  }, "\uCD08\uAE30\uD654"), /*#__PURE__*/React.createElement(Button, null, "\uD655\uC778"))), /*#__PURE__*/React.createElement(Tabs, {
    items: ['상담이력', '콜백이력', '녹취이력', '알림방송이력'],
    style: {
      marginBottom: 10
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(Select, {
    options: ['조회일자구분']
  }), /*#__PURE__*/React.createElement(DateRange, {
    defaultStart: "2021-03-02",
    defaultEnd: "2021-03-09"
  }), /*#__PURE__*/React.createElement(Select, {
    options: ['기간']
  }), /*#__PURE__*/React.createElement(Select, {
    options: ['상품기간']
  }), /*#__PURE__*/React.createElement(Select, {
    options: ['유입채널']
  })), /*#__PURE__*/React.createElement(DataGrid, {
    height: 140,
    columns: [{
      key: 'dt',
      label: '상담일시'
    }, {
      key: 'tp',
      label: '상담업무구분'
    }, {
      key: 'who',
      label: '상담자'
    }, {
      key: 'memo',
      label: '상담메모',
      align: 'left'
    }],
    rows: [{
      dt: '2021-03-02 14:10',
      tp: '대출상담',
      who: '홍길동',
      memo: '한도 산출 결과 문의'
    }, {
      dt: '2021-03-01 09:42',
      tp: '상환문의',
      who: '김상담',
      memo: '중도상환수수료 안내'
    }]
  })))));
}
window.CustomerScreen = CustomerScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/CustomerScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/DashboardScreen.jsx
try { (() => {
const DS_D = window.PepperDigitalAdminDesignSystem_0682d9;
function DashRefresh() {
  const {
    Button,
    Icon
  } = DS_D;
  return /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "refresh"
  }));
}
function ChartToggle() {
  const {
    Pills,
    Icon
  } = DS_D;
  return /*#__PURE__*/React.createElement(Pills, {
    size: "sm",
    items: [{
      value: 'line',
      label: /*#__PURE__*/React.createElement(Icon, {
        name: "lineChart"
      })
    }, {
      value: 'bar',
      label: /*#__PURE__*/React.createElement(Icon, {
        name: "barChart"
      })
    }]
  });
}
const STAGES = [['서류제출', 'green', '정상', [218, 20, 0]], ['한도산출', 'red', '오류', [218, 20, 3]], ['대환선택', 'green', '정상', [196, 12, 0]], ['본인확인', 'green', '정상', [180, 9, 0]], ['전자약정', 'green', '정상', [152, 6, 0]], ['기표/송금', 'green', '정상', [129, 4, 0]]];
function DashboardScreen() {
  const {
    Panel,
    StatTile,
    SummaryStat,
    StatusCircle,
    Button,
    Icon,
    DateInput,
    Select,
    DataGrid
  } = DS_D;
  const [tick, setTick] = React.useState(0);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 10,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "edit"
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "fullscreen"
  })), /*#__PURE__*/React.createElement(DateInput, {
    defaultValue: "2021-04-15"
  }), /*#__PURE__*/React.createElement(Button, {
    onClick: () => setTick(tick + 1)
  }, "\uC804\uCCB4\uAC31\uC2E0"), /*#__PURE__*/React.createElement(Select, {
    options: ['30초', '1분', '5분']
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 4fr 3fr 3fr',
      gap: 10,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    fill: true,
    title: "\uB300\uCD9C\uC2E4\uD589\uC694\uC57D",
    meta: "(\uB2E8\uC704 \uAC74 / \uBC31\uB9CC\uC6D0)",
    actions: /*#__PURE__*/React.createElement(DashRefresh, null)
  }, /*#__PURE__*/React.createElement(SummaryStat, {
    label: "4/15",
    count: "129",
    amount: "4,865.2",
    delta: "358.1",
    trend: "up"
  }), /*#__PURE__*/React.createElement(SummaryStat, {
    label: "MTD",
    count: "1,562",
    amount: "52,541.9",
    delta: "4,320.2",
    trend: "down"
  }), /*#__PURE__*/React.createElement(SummaryStat, {
    label: "MRR",
    count: "3,081",
    amount: "109,221.8",
    delta: "9,119.5",
    trend: "down"
  }), /*#__PURE__*/React.createElement(SummaryStat, {
    label: "TGT",
    count: "3,081",
    amount: "109,221.8",
    delta: "9,119.5",
    trend: "down"
  })), /*#__PURE__*/React.createElement(Panel, {
    fill: true,
    title: "\uC0C1\uD0DC\uBCC4 \uD604\uD669",
    actions: /*#__PURE__*/React.createElement(DashRefresh, null)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 10
    }
  }, [['서류제출', '2,453'], ['신청접수', '218'], ['승인', '83'], ['보류', '12'], ['진행중', '68'], ['대출실행', '129'], ['중단', '16'], ['신청취소', '5']].map(([l, v]) => /*#__PURE__*/React.createElement(StatTile, {
    key: l,
    label: l,
    value: v
  })))), /*#__PURE__*/React.createElement(Panel, {
    fill: true,
    title: "\uC720\uC785 \uD604\uD669",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ChartToggle, null), /*#__PURE__*/React.createElement(DashRefresh, null))
  }, /*#__PURE__*/React.createElement(ChartSlot, null)), /*#__PURE__*/React.createElement(Panel, {
    fill: true,
    title: "\uC2E4\uC801 \uD604\uD669",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ChartToggle, null), /*#__PURE__*/React.createElement(DashRefresh, null))
  }, /*#__PURE__*/React.createElement(ChartSlot, null))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '6fr 3fr 3fr',
      gap: 10,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    fill: true,
    title: "\uC9C4\uD589 \uB2E8\uACC4\uBCC4 \uD604\uD669",
    actions: /*#__PURE__*/React.createElement(DashRefresh, null)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(6,1fr)',
      gap: 10
    }
  }, STAGES.map(([n, tone, st, [a, b, c]]) => /*#__PURE__*/React.createElement(StatTile, {
    key: n,
    padding: "15px 10px"
  }, /*#__PURE__*/React.createElement("h6", {
    style: {
      marginBottom: 10,
      fontSize: 15
    }
  }, n), /*#__PURE__*/React.createElement(StatusCircle, {
    tone: tone,
    bold: true,
    fontSize: 16,
    style: {
      marginBottom: 10
    }
  }, st), [['완료', a], ['처리중', b], ['오류', c]].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '3px 5px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: '#6c757d'
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      fontWeight: 700
    }
  }, v))))))), /*#__PURE__*/React.createElement(Panel, {
    fill: true,
    title: "\uC0C1\uD488\uBCC4 \uC720\uC785",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ChartToggle, null), /*#__PURE__*/React.createElement(DashRefresh, null))
  }, /*#__PURE__*/React.createElement(ChartSlot, {
    height: 250
  })), /*#__PURE__*/React.createElement(Panel, {
    fill: true,
    title: "\uC0C1\uD488\uBCC4 \uC2E4\uC801",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ChartToggle, null), /*#__PURE__*/React.createElement(DashRefresh, null))
  }, /*#__PURE__*/React.createElement(ChartSlot, {
    height: 250
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '6fr 3fr 3fr',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    fill: true,
    title: "\uCC44\uB110 \uC720\uC785 \uD604\uD669",
    actions: /*#__PURE__*/React.createElement(DashRefresh, null)
  }, /*#__PURE__*/React.createElement(DataGrid, {
    height: 205,
    columns: [{
      key: 'ch',
      label: '유입채널'
    }, {
      key: 'a',
      label: '신청',
      align: 'right'
    }, {
      key: 'b',
      label: '승인',
      align: 'right'
    }, {
      key: 'c',
      label: '실행',
      align: 'right'
    }, {
      key: 'd',
      label: '실행금액(백만원)',
      align: 'right'
    }],
    rows: [{
      ch: '토스',
      a: 1204,
      b: 412,
      c: 61,
      d: 2318.4
    }, {
      ch: '카카오페이',
      a: 842,
      b: 301,
      c: 38,
      d: 1402.1
    }, {
      ch: '핀다',
      a: 311,
      b: 98,
      c: 17,
      d: 590.5
    }, {
      ch: '자사앱',
      a: 96,
      b: 41,
      c: 13,
      d: 554.2
    }]
  })), /*#__PURE__*/React.createElement(Panel, {
    fill: true,
    title: "\uCC44\uB110\uBCC4 \uC720\uC785",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ChartToggle, null), /*#__PURE__*/React.createElement(DashRefresh, null))
  }, /*#__PURE__*/React.createElement(ChartSlot, null)), /*#__PURE__*/React.createElement(Panel, {
    fill: true,
    title: "\uCC44\uB110\uBCC4 \uC2E4\uC801",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ChartToggle, null), /*#__PURE__*/React.createElement(DashRefresh, null))
  }, /*#__PURE__*/React.createElement(ChartSlot, null))));
}
window.DashboardScreen = DashboardScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/DashboardScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/LoginScreen.jsx
try { (() => {
function LoginScreen({
  onLogin
}) {
  const [id, setId] = React.useState('');
  const [save, setSave] = React.useState(true);
  const inp = {
    display: 'block',
    width: '100%',
    height: 56,
    padding: '0 10px',
    borderRadius: 5,
    border: '1px solid #CDCDCD',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'var(--font-sans)'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      height: '100vh',
      minWidth: 1024,
      minHeight: 768,
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pp-img-login-bg",
    style: {
      height: '100%',
      paddingBottom: 50,
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: '18%',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 460,
      padding: '40px 60px',
      background: '#fff',
      borderRadius: 10,
      textAlign: 'center',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 35,
      lineHeight: '35px',
      fontSize: 18,
      fontWeight: 700,
      color: '#303030'
    }
  }, "Digital Admin System"), /*#__PURE__*/React.createElement("span", {
    className: "pp-img-login-logo",
    role: "img",
    "aria-label": "\uD398\uD37C\uC800\uCD95\uC740\uD589 \uB85C\uACE0"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 26,
      display: 'grid',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("input", {
    style: inp,
    placeholder: "\uC0AC\uC6A9\uC790\uC544\uC774\uB514",
    value: id,
    onChange: e => setId(e.target.value)
  }), /*#__PURE__*/React.createElement("input", {
    style: inp,
    type: "password",
    placeholder: "\uBE44\uBC00\uBC88\uD638",
    defaultValue: "password"
  }), /*#__PURE__*/React.createElement("input", {
    style: inp,
    type: "password",
    placeholder: "OTP\uBC88\uD638"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onLogin,
    style: {
      marginTop: 10,
      width: '100%',
      height: 60,
      border: 0,
      borderRadius: 5,
      background: '#DF0024',
      color: '#fff',
      fontSize: 20,
      boxShadow: '4px 0 10px rgba(223,0,36,.25)',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)'
    }
  }, "\uB85C\uADF8\uC778"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      minHeight: 35,
      marginTop: 15,
      alignItems: 'center',
      justifyContent: 'space-between',
      color: '#707070'
    }
  }, /*#__PURE__*/React.createElement("label", {
    onClick: () => setSave(!save),
    className: 'pp-img-login-check' + (save ? ' on' : ''),
    style: {
      paddingLeft: 30,
      cursor: 'pointer'
    }
  }, "\uC544\uC774\uB514 \uC800\uC7A5"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: '#707070'
    }
  }, "\uBE44\uBC00\uBC88\uD638 \uC7AC\uC124\uC815"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      width: '100%',
      height: 50,
      background: '#2D2F3A',
      display: 'flex',
      alignItems: 'center',
      padding: '0 40px',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginRight: 'auto',
      fontSize: 12,
      color: '#fff',
      opacity: .5
    }
  }, "Copyright \u24D2 PEPPER SAVINGS BANK.ALL rights reserved."), /*#__PURE__*/React.createElement("span", {
    className: "pp-img-footer-logo",
    role: "img",
    "aria-label": "\uD398\uD37C\uC800\uCD95\uC740\uD589"
  })));
}
window.LoginScreen = LoginScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/LoginScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/NoticeScreen.jsx
try { (() => {
const DS_N = window.PepperDigitalAdminDesignSystem_0682d9;
function NoticeScreen({
  onSubmit
}) {
  const {
    FieldTable,
    Input,
    Checkbox,
    Textarea,
    InputGroup,
    Button
  } = DS_N;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageTitle, null, "\uACF5\uC9C0\uC0AC\uD56D/\uC774\uBCA4\uD2B8\uAD00\uB9AC"), /*#__PURE__*/React.createElement(FieldTable, {
    variant: "bordered",
    columns: 1,
    labelWidth: "15%",
    valueWidth: "85%",
    style: {
      marginBottom: 30
    },
    rows: [[{
      label: '제목',
      render: /*#__PURE__*/React.createElement(Input, {
        style: {
          display: 'block',
          width: '100%'
        }
      })
    }], [{
      label: '노출대상',
      render: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Checkbox, {
        label: "\uD0DC\uBE14\uB9BF",
        defaultChecked: true
      }), /*#__PURE__*/React.createElement(Checkbox, {
        label: "\uAD00\uB9AC\uC790",
        defaultChecked: true
      }))
    }], [{
      label: '중요도',
      render: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Checkbox, {
        label: "\uC77C\uBC18",
        defaultChecked: true
      }), /*#__PURE__*/React.createElement(Checkbox, {
        label: "\uC911\uC694"
      }))
    }], [{
      label: '팝업노출',
      render: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Checkbox, {
        label: "\uC5C6\uC74C",
        defaultChecked: true
      }), /*#__PURE__*/React.createElement(Checkbox, {
        label: "\uD31D\uC5C5\uB178\uCD9C"
      }))
    }], [{
      label: '내용',
      labelAlign: 'top',
      render: /*#__PURE__*/React.createElement(Textarea, {
        rows: 6
      })
    }], [{
      label: '파일첨부',
      render: /*#__PURE__*/React.createElement(InputGroup, {
        icon: "search",
        width: 160
      })
    }]]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline"
  }, "\uCDE8\uC18C"), /*#__PURE__*/React.createElement(Button, {
    onClick: onSubmit
  }, "\uB4F1\uB85D")));
}
function ErrorScreen({
  onHome
}) {
  const {
    Button
  } = DS_N;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 'calc(100vh - 90px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%,-50%)',
      width: 990,
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 340,
      minWidth: 340,
      height: 340,
      lineHeight: '340px',
      borderRadius: '50%',
      background: '#f5f5f5',
      fontSize: 110,
      fontWeight: 700,
      color: '#b1b1b1',
      textAlign: 'center'
    }
  }, "404"), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingLeft: 100
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 40
    }
  }, "Not Found!"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 20,
      fontSize: 14,
      color: '#909090'
    }
  }, "\uC8C4\uC1A1\uD569\uB2C8\uB2E4. \uD604\uC7AC \uCC3E\uC744 \uC218 \uC5C6\uB294 \uD398\uC774\uC9C0\uB97C \uC694\uCCAD\uD558\uC168\uC2B5\uB2C8\uB2E4.", /*#__PURE__*/React.createElement("br", null), "\uC874\uC7AC\uD558\uC9C0 \uC54A\uB294 \uC8FC\uC18C\uB97C \uC785\uB825\uD558\uC168\uAC70\uB098, \uC694\uCCAD\uD558\uC2E0 \uD398\uC774\uC9C0\uC758 \uC8FC\uC18C\uAC00 \uBCC0\uACBD/\uC0AD\uC81C\uB418\uC5B4 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4."), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    style: {
      marginTop: 35
    },
    onClick: onHome
  }, "\uBA54\uC778\uC73C\uB85C"))));
}
Object.assign(window, {
  NoticeScreen,
  ErrorScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/NoticeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/Shell.jsx
try { (() => {
const {
  AppHeader,
  Lnb
} = window.PepperDigitalAdminDesignSystem_0682d9;
const LNB_TREE = {
  회원: [{
    label: '회원',
    open: true,
    children: [{
      label: '고객상담',
      id: 'customer'
    }, {
      label: '회원조회',
      id: 'customer2'
    }]
  }, {
    label: '고객정보',
    children: [{
      label: '고객정보변경'
    }]
  }],
  여신: [{
    label: '여신',
    open: true,
    children: [{
      label: '대출현황',
      open: true,
      children: [{
        label: '대시보드',
        id: 'dashboard'
      }, {
        label: '대출신청관리',
        id: 'applications'
      }]
    }, {
      label: '심사',
      children: [{
        label: '심사현황'
      }, {
        label: '심사이력'
      }]
    }]
  }, {
    label: '계좌',
    children: [{
      label: '계좌조회'
    }, {
      label: '상환관리'
    }]
  }],
  수신: [{
    label: '수신',
    open: true,
    children: [{
      label: '예금계좌조회'
    }, {
      label: '해지관리'
    }]
  }],
  고객지원: [{
    label: '고객지원',
    open: true,
    children: [{
      label: '공지사항/이벤트관리',
      id: 'notice'
    }, {
      label: '상담이력'
    }]
  }],
  마케팅: [{
    label: '마케팅',
    open: true,
    children: [{
      label: '캠페인'
    }, {
      label: '알림발송'
    }]
  }],
  설정: [{
    label: '설정',
    open: true,
    children: [{
      label: '권한관리',
      id: 'denied'
    }]
  }],
  보고서: [{
    label: '보고서',
    open: true,
    children: [{
      label: '일일보고서'
    }]
  }],
  시스템: [{
    label: '시스템',
    open: true,
    children: [{
      label: '없는 페이지',
      id: 'error'
    }]
  }]
};
function AppShell({
  menu,
  onMenu,
  screen,
  onScreen,
  onLogout,
  children
}) {
  const [lnbOpen, setLnbOpen] = React.useState(true);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 1860,
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#fff'
    }
  }, /*#__PURE__*/React.createElement(AppHeader, {
    active: menu,
    onNavigate: onMenu,
    onLogout: onLogout
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement(Lnb, {
    key: menu,
    tree: LNB_TREE[menu] || [],
    activeId: screen,
    onSelect: id => onScreen(id),
    open: lnbOpen,
    onToggleOpen: setLnbOpen
  }), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      minWidth: 0,
      overflow: 'auto',
      padding: lnbOpen ? '20px 30px' : '20px 30px 20px 53px'
    }
  }, children)));
}
function PageTitle({
  children,
  right
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      borderBottom: '1px solid #dee2e6',
      marginBottom: 20,
      padding: '0 0 10px 10px'
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 24,
      fontWeight: 700,
      lineHeight: 1.2,
      marginRight: 'auto'
    }
  }, children), right);
}

// Source screens leave chart/grid areas as outlined "conts" boxes (rMate Chart renders there at runtime).
function ChartSlot({
  height = 205,
  label = 'rMate Chart'
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height,
      outline: '1px solid #707070',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#909090',
      fontSize: 12
    }
  }, label);
}
Object.assign(window, {
  AppShell,
  PageTitle,
  ChartSlot,
  LNB_TREE
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/Shell.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.ICON_NAMES = __ds_scope.ICON_NAMES;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Separator = __ds_scope.Separator;

__ds_ns.DataGrid = __ds_scope.DataGrid;

__ds_ns.FieldTable = __ds_scope.FieldTable;

__ds_ns.Panel = __ds_scope.Panel;

__ds_ns.StatTile = __ds_scope.StatTile;

__ds_ns.StatusCircle = __ds_scope.StatusCircle;

__ds_ns.StepProgress = __ds_scope.StepProgress;

__ds_ns.SummaryStat = __ds_scope.SummaryStat;

__ds_ns.AlertModal = __ds_scope.AlertModal;

__ds_ns.Loading = __ds_scope.Loading;

__ds_ns.Modal = __ds_scope.Modal;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.ChoiceControl = __ds_scope.ChoiceControl;

__ds_ns.DateInput = __ds_scope.DateInput;

__ds_ns.DateRange = __ds_scope.DateRange;

__ds_ns.Datepicker = __ds_scope.Datepicker;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.InputGroup = __ds_scope.InputGroup;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.RadioGroup = __ds_scope.RadioGroup;

__ds_ns.SearchBar = __ds_scope.SearchBar;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.AppHeader = __ds_scope.AppHeader;

__ds_ns.Lnb = __ds_scope.Lnb;

__ds_ns.Pills = __ds_scope.Pills;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
