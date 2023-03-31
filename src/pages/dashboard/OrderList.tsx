import axios from 'axios';
import { filter } from 'lodash';
import { useSnackbar } from 'notistack5';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import { manageService } from '_apis_/service';
import { manageOrder } from '_apis_/order';
import moment from 'moment';
// material
import { useTheme } from '@material-ui/core/styles';
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  CircularProgress,
  Grid,
  TextField
} from '@material-ui/core';
// lang
import useLocales from 'hooks/useLocales';
import { DesktopDatePicker } from '@material-ui/lab';
import OrderMoreMenu from 'components/_dashboard/order/list/OrderMoreMenu';
import useAuth from 'hooks/useAuth';
// redux
import { RootState, useDispatch, useSelector } from '../../redux/store';
import { getListPatient, deleteDiver } from '../../redux/slices/patient';
import { getListService, deleteService } from '../../redux/slices/service';
import { getListOrder } from '../../redux/slices/order';

// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks

import useSettings from '../../hooks/useSettings';
// @types
import { Diver } from '../../@types/diver';
import { Service } from '../../@types/service';
import { Order } from '../../@types/order';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// import {
//   DiverListHead,
//   DiverListToolbar,
//   DiverMoreMenu
// } from '../../components/_dashboard/diver/list';

import { ServiceListHead, ServiceMoreMenu } from '../../components/_dashboard/service/list';

import { OrderListToolbar } from '../../components/_dashboard/order/list';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

type Anonymous = Record<string | number, string>;

function descendingComparator(a: Anonymous, b: Anonymous, orderBy: string) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order: string, orderBy: string) {
  return order === 'desc'
    ? (a: Anonymous, b: Anonymous) => descendingComparator(a, b, orderBy)
    : (a: Anonymous, b: Anonymous) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array: Order[], comparator: (a: any, b: any) => number, query: string) {
  const stabilizedThis = array.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_diver) => _diver.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserList() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const dispatch = useDispatch();
  // const diverList = useSelector((state: RootState) => state.diver.diverList);
  // const serviceList = useSelector((state: RootState) => state.service.serviceList);
  const orderList = useSelector((state: RootState) => state.order.orderList);
  const totalCount = useSelector((state: RootState) => state.order.totalCount);
  const isLoading = useSelector((state: RootState) => state.order.isLoading);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { user } = useAuth();
  const [date, setDate] = useState(new Date().toString());
  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const TABLE_HEAD = [
    { id: 'Name', label: translate('model.order.field.name'), alignRight: false },
    { id: 'Create time', label: translate('model.order.field.createTime'), alignRight: false },
    { id: 'StaffID', label: translate('model.order.field.staffId'), alignRight: false },
    { id: 'Email', label: translate('model.order.field.email'), alignRight: false },
    { id: 'Phone', label: translate('model.order.field.phone'), alignRight: false },
    //   { id: 'MediaUrl', label: 'MediaUrl', alignRight: false },
    { id: 'total', label: translate('model.order.field.total'), alignRight: false },
    { id: 'status', label: translate('model.order.field.status'), alignRight: false },
    { id: '' }
  ];

  const handleSelectAllClick = (checked: boolean) => {
    if (checked) {
      const newSelecteds = orderList.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  function convertUTCDateToLocalDate(date: any) {
    const newDate = new Date(date);
    return newDate.toLocaleDateString();
  }

  const handleClick = (name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChange = (newValue: any) => {
    const newDate = new Date(newValue);
    setDate(newDate.toString());
  };
  const handleFilterByName = (filterName: string) => {
    setFilterName(filterName);
  };

  const handleCancelOrder = async (id: string, reason: string) => {
    const newDate = new Date(date);
    const dateFormat = moment(newDate).format('yyyy/MM/DD');

    try {
      await manageOrder.cancelOrderByID(id, reason).then((respone) => {
        if (respone.status === 200) {
          enqueueSnackbar('Cancel success', { variant: 'success' });
          dispatch(getListOrder(user?.siteid, rowsPerPage, page, dateFormat));
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const newDate = new Date(date);
    const dateFormat = moment(newDate).format('yyyy/MM/DD');
    dispatch(getListOrder(user?.siteid, rowsPerPage, page, dateFormat));
  }, [dispatch, rowsPerPage, page, date]);

  const emptyRows = !isLoading && !orderList;
  const filteredDiver = applySortFilter(orderList, getComparator(order, orderBy), filterName);

  const isDiverNotFound = orderList.length === 0 && isLoading;

  return (
    <Page title={translate('model.order.list_name')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('model.order.list_name')}
          links={[
            { name: translate('root.dashboard'), href: PATH_DASHBOARD.root },
            { name: translate('root.order'), href: PATH_DASHBOARD.order.root },
            { name: translate('root.list') }
          ]}
        />
        <Card>
          <Grid container>
            <Grid item xs={3} md={3}>
              <OrderListToolbar
                numSelected={selected.length}
                filterName={filterName}
                onFilterName={handleFilterByName}
              />
            </Grid>

            <Grid item xs={3} md={3} marginTop="20px">
              <DesktopDatePicker
                maxDate={new Date()}
                // views={['year', 'month']}
                label={translate('model.report.label.date')}
                inputFormat="yyyy/MM/dd"
                value={date}
                onChange={handleChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </Grid>
          </Grid>
          <Scrollbar>
            {!isLoading ? (
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <ServiceListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={orderList.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredDiver.map((row) => {
                      const {
                        id,
                        name,
                        phone,
                        mediaUrl,
                        status,
                        total,
                        email,
                        staffId,
                        createTime
                      } = row;
                      const isItemSelected = selected.indexOf(name) !== -1;
                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            {/* <Checkbox checked={isItemSelected} onClick={() => handleClick(name)} /> */}
                          </TableCell>
                          {/* <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar alt={name} src={name} />
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell> */}
                          <TableCell align="left">{name}</TableCell>
                          <TableCell align="left">
                            {convertUTCDateToLocalDate(createTime || '')}
                          </TableCell>
                          <TableCell align="left">{staffId}</TableCell>
                          <TableCell align="left">{email}</TableCell>
                          <TableCell align="left">{phone}</TableCell>
                          <TableCell align="left">{total}</TableCell>
                          <TableCell align="left">
                            <Label
                              variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                              // color={(status === 0 && 'error') || 'success'}
                              color={(() => {
                                switch (status) {
                                  case 1:
                                    return 'secondary';
                                  case 0:
                                    return 'error';
                                  case 3:
                                    return 'primary';
                                  default:
                                    return 'error';
                                }
                              })()}
                            >
                              {/* {status == 1 ? translate('Status.New') : translate('Status.cancel')} */}
                              {(() => {
                                switch (status) {
                                  case 1:
                                    return translate('Status.new');
                                  case 0:
                                    return translate('Status.cancel');
                                  case 3:
                                    return translate('Status.complete');
                                  default:
                                    return 'null';
                                }
                              })()}
                            </Label>
                          </TableCell>
                          {/* <TableCell align="left">
                            <Label
                              variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                              color={(status == 0 && 'error') || 'success'}
                            >
                              {status == 1 ? 'Available' : 'deleted'}
                            </Label>
                          </TableCell> */}

                          <TableCell align="right">
                            <OrderMoreMenu
                              onCancelOrder={handleCancelOrder}
                              orderID={id.toString()}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {emptyRows && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                  {isDiverNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={filterName} />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            ) : (
              <Stack sx={{ mt: 3 }} alignItems="center">
                <CircularProgress />
              </Stack>
            )}
          </Scrollbar>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, value) => {
              setPage(value);
              console.log(value);
            }}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
