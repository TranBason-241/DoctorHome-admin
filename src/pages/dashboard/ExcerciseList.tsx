import axios from 'axios';
import { filter } from 'lodash';
import { useSnackbar } from 'notistack5';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { manageDiver } from '_apis_/diver';
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
import { getListPartner } from 'redux/slices/partner';
import { managePartner } from '_apis_/partner';
import useAuth from 'hooks/useAuth';
// lang
import useLocales from 'hooks/useLocales';
// redux
import { RootState, useDispatch, useSelector } from '../../redux/store';
import { getListDiver, deleteDiver } from '../../redux/slices/diver';
import { getListExcercise } from '../../redux/slices/excercise';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// @types
import { Diver } from '../../@types/diver';
import { Partner } from '../../@types/partner';

// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
  DiverListHead,
  DiverListToolbar,
  DiverMoreMenu
} from '../../components/_dashboard/diver/list';

import {
  PartnerListHead,
  PartnerListToolbar,
  PartnerMoreMenu
} from '../../components/_dashboard/partner/list';
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

function applySortFilter(array: Partner[], comparator: (a: any, b: any) => number, query: string) {
  const stabilizedThis = array.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_partner) => _partner.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function ExcerciseList() {
  const { translate } = useLocales();
  const { user } = useAuth();
  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const { name } = useParams();
  const dispatch = useDispatch();
  // const diverList = useSelector((state: RootState) => state.diver.diverList);
  const partnerSiteList = useSelector((state: RootState) => state.partner.partnerList);
  const totalCount = useSelector((state: RootState) => state.partner.totalCount);
  const isLoading = useSelector((state: RootState) => state.partner.isLoading);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const TABLE_HEAD = [
    { id: 'name', label: translate('model.Partner.field.name'), alignRight: false },
    { id: 'phone', label: translate('model.Partner.field.phone'), alignRight: false },
    { id: 'email', label: translate('model.Partner.field.email'), alignRight: false },
    { id: 'address', label: translate('model.Partner.field.address'), alignRight: false },
    { id: 'Status', label: translate('model.Partner.field.status'), alignRight: false },
    { id: '' }
  ];

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked: boolean) => {
    if (checked) {
      const newSelecteds = partnerSiteList.map((n) => n.name);
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

  const handleDeletePartner = async (id: string) => {
    console.log(user?.siteid);
    try {
      await managePartner.deletePartner(id, user?.siteid).then((respone) => {
        if (respone.status === 200) {
          enqueueSnackbar('Delete success', { variant: 'success' });
          dispatch(getListPartner(user?.siteid, rowsPerPage, page));
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(getListExcercise(Number(name), rowsPerPage, page));
  }, [dispatch, rowsPerPage, page]);

  const emptyRows = !isLoading && !partnerSiteList;

  const filteredDiver = applySortFilter(partnerSiteList, getComparator(order, orderBy), filterName);

  const isDiverNotFound = partnerSiteList.length === 0 && isLoading;
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
    <Page title="Danh sách bài tập">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách bài tập"
          links={[
            { name: 'Bản điều khiển', href: PATH_DASHBOARD.root },
            { name: 'danh sách loại bài tập', href: PATH_DASHBOARD.exerciseType.list },
            { name: 'Danh sách bài tập' }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.partner.newPartner}
              startIcon={<Icon icon={plusFill} />}
            >
              Thêm bài tập
            </Button>
          }
        />
        <Card>
          <PartnerListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            {!isLoading ? (
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <DiverListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={partnerSiteList.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredDiver.map((row) => {
                      const { id, name, phone, email, address, partnerType, status } = row;
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
                              <Avatar alt={name} src={imageUrl} />
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell> */}
                          <TableCell align="left">{name}</TableCell>
                          <TableCell align="left">{phone}</TableCell>
                          <TableCell align="left">{email}</TableCell>
                          <TableCell align="left">{address}</TableCell>
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
                          {/* <TableCell align="left">
                            <Label
                              variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                              color={(status == 0 && 'error') || 'success'}
                            >
                              {status == 1 ? 'Available' : 'deleted'}
                            </Label>
                          </TableCell> */}

                          <TableCell align="right">
                            <PartnerMoreMenu
                              onDelete={() => handleDeletePartner(id.toString())}
                              diverID={id.toString()}
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
