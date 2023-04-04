import axios from 'axios';
import { filter } from 'lodash';
import { useSnackbar } from 'notistack5';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import { manageService } from '_apis_/service';
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
  CircularProgress
} from '@material-ui/core';
import useLocales from 'hooks/useLocales';
import useAuth from 'hooks/useAuth';
// redux
import { RootState, useDispatch, useSelector } from '../../redux/store';
// import { getListDiver, deleteDiver } from '../../redux/slices/patient';
import { getListService, deleteService } from '../../redux/slices/service';

// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// @types
import { Diver } from '../../@types/diver';
import { Service } from '../../@types/service';
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

import {
  ServiceListHead,
  ServiceListToolbar,
  ServiceMoreMenu
} from '../../components/_dashboard/service/list';

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

function applySortFilter(array: Service[], comparator: (a: any, b: any) => number, query: string) {
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

  const TABLE_HEAD = [
    { id: 'name', label: translate('model.Product.field.name'), alignRight: false },
    { id: 'Category', label: translate('model.Product.field.category'), alignRight: false },
    { id: 'price', label: translate('model.Product.field.price'), alignRight: false },
    { id: 'status', label: translate('model.Product.field.status'), alignRight: false },
    { id: '' }
  ];

  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const dispatch = useDispatch();
  // const diverList = useSelector((state: RootState) => state.diver.diverList);
  const serviceList = useSelector((state: RootState) => state.service.serviceList);
  const totalCount = useSelector((state: RootState) => state.service.totalCount);
  const isLoading = useSelector((state: RootState) => state.service.isLoading);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { user } = useAuth();
  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked: boolean) => {
    if (checked) {
      const newSelecteds = serviceList.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

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

  const handleFilterByName = (filterName: string) => {
    setFilterName(filterName);
  };

  const handleDeleteService = async (id: string) => {
    console.log('delete');
    try {
      await manageService.deleteService(id).then((respone) => {
        if (respone.status === 200) {
          enqueueSnackbar('Delete success', { variant: 'success' });
          dispatch(getListService(user?.siteid, rowsPerPage, page));
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // dispatch(getListDiver());
    dispatch(getListService(user?.siteid, rowsPerPage, page));
  }, [dispatch, rowsPerPage, page]);

  const emptyRows = !isLoading && !serviceList;

  const filteredDiver = applySortFilter(serviceList, getComparator(order, orderBy), filterName);

  const isDiverNotFound = serviceList.length === 0 && isLoading;
  // if (companiesList !== null) {
  //   companiesList.map((item, index) => {
  //     return (
  //       <div key={index}>
  //         <h1>{item[index]}</h1>
  //       </div>
  //     );
  //   });
  // }

  return (
    <Page title="Danh sách sản phẩm">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('model.Product.list_name')}
          links={[
            { name: translate('root.dashboard'), href: PATH_DASHBOARD.root },
            { name: translate('root.product'), href: PATH_DASHBOARD.service.root },
            { name: translate('root.list') }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.service.newService}
              startIcon={<Icon icon={plusFill} />}
            >
              {translate('model.Product.action.createProduct')}
            </Button>
          }
        />
        <Card>
          <ServiceListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            {!isLoading ? (
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <ServiceListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={serviceList.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredDiver.map((row) => {
                      const { id, name, categoryId, price, mediaUrl, status, categoryName } = row;
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
                          <TableCell component="th" scope="row" padding="none">
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </TableCell>
                          <TableCell align="left">{categoryName}</TableCell>

                          <TableCell align="left">
                            {parseInt(price, 10).toLocaleString('it-IT', {
                              style: 'currency',
                              currency: 'VND'
                            })}
                          </TableCell>
                          <TableCell align="left">
                            <Label
                              variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                              color={(status === 0 && 'error') || 'success'}
                            >
                              {status == 1
                                ? translate('Status.availble')
                                : translate('Status.unAvailble')}
                            </Label>
                          </TableCell>

                          <TableCell align="right">
                            <ServiceMoreMenu
                              onDelete={() => handleDeleteService(id.toString())}
                              serviceID={id.toString()}
                              status={status.toString()}
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
            onPageChange={(e, value) => setPage(value)}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
