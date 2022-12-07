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
  TablePagination
} from '@material-ui/core';
import useLocales from 'hooks/useLocales';
import { manageGroup } from '_apis_/group';
import { getListGroup } from 'redux/slices/group';
// redux
import { RootState, useDispatch, useSelector } from '../../redux/store';

import { getListDiver, deleteDiver } from '../../redux/slices/diver';
import { getListService, deleteService } from '../../redux/slices/service';
import { getListGroupRole, deleteGroupRole } from '../../redux/slices/groupRole';

// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// @types

import { Group } from '../../@types/group';

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

import { GroupListHead, GroupToolBar, GroupMoreMenu } from '../../components/_dashboard/group/list';

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

function applySortFilter(array: Group[], comparator: (a: any, b: any) => number, query: string) {
  const stabilizedThis = array.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_diver) => _diver.id.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function GroupList() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const dispatch = useDispatch();
  // const diverList = useSelector((state: RootState) => state.diver.diverList);
  //   const serviceList = useSelector((state: RootState) => state.service.serviceList);
  const groupList = useSelector((state: RootState) => state.group.groupList);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const TABLE_HEAD = [
    { id: 'id', label: translate('model.group.field.id'), alignRight: false },
    { id: 'startTime', label: translate('model.group.field.startTime'), alignRight: false },
    { id: 'endTime', label: translate('model.group.field.endTime'), alignRight: false },
    { id: 'timeTo', label: translate('model.group.field.timeTo'), alignRight: false },
    { id: 'licenseLate', label: translate('model.group.field.licenseLate'), alignRight: false },
    { id: 'status', label: translate('model.group.field.status'), alignRight: false }
  ];
  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked: boolean) => {
    if (checked) {
      const newSelecteds = groupList.map((n) => n.id);
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

  const handleDeleteGroupRole = async (id: string) => {
    console.log('delete');
    try {
      await manageGroup.deleteGroup(id).then((respone) => {
        if (respone.status === 200) {
          enqueueSnackbar('Delete success', { variant: 'success' });
          dispatch(getListGroupRole());
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // dispatch(getListDiver());
    dispatch(getListGroup());
  }, [dispatch]);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - groupList.length) : 0;

  const filteredDiver = applySortFilter(groupList, getComparator(order, orderBy), filterName);

  const isDiverNotFound = filteredDiver.length === 0;
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
    <Page title="Group: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Group list"
          links={[
            { name: translate('root.dashboard'), href: PATH_DASHBOARD.root },
            { name: translate('root.group'), href: PATH_DASHBOARD.group.root },
            { name: translate('root.list') }
          ]}
          //   action={
          //     <Button
          //       variant="contained"
          //       component={RouterLink}
          //       to={PATH_DASHBOARD.groupRole.newGroupRole}
          //       startIcon={<Icon icon={plusFill} />}
          //     >
          //       New groupRole
          //     </Button>
          //   }
        />
        <Card>
          <GroupToolBar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <GroupListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={groupList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredDiver
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { id, startTime, endTime, timeTo, licenseLate, status } = row;
                      const isItemSelected = selected.indexOf(id) !== -1;
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
                          <TableCell align="left">{id}</TableCell>
                          <TableCell align="left">22</TableCell>
                          <TableCell align="left">{endTime}</TableCell>
                          <TableCell align="left">{timeTo}</TableCell>
                          <TableCell align="left">{licenseLate}</TableCell>
                          <TableCell align="left">
                            <Label
                              variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                              color={(status == '0' && 'error') || 'success'}
                            >
                              {status == '1'
                                ? translate('Status.availble')
                                : translate('Status.deleted')}
                            </Label>
                          </TableCell>
                          <TableCell align="right">
                            <GroupMoreMenu
                              onDelete={() => handleDeleteGroupRole(id.toString())}
                              groupID={id.toString()}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
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
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={groupList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, page) => setPage(page)}
            onRowsPerPageChange={(e) => handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
