import { merge } from 'lodash';
import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
// lang
import useLocales from 'hooks/useLocales';
import useAuth from 'hooks/useAuth';
// material
import { Card, CardHeader, Box, TextField } from '@material-ui/core';
import { manageOrder } from '_apis_/order';
// redux
import { useSelector, RootState, useDispatch } from 'redux/store';

import { Order, MonthList } from '../../../@types/order';
// reducer
//
import { BaseOptionChart } from '../../charts';

// ----------------------------------------------------------------------

export default function AppAreaInstalled() {
  const dispatch = useDispatch();
  const [seriesData, setSeriesData] = useState(2022);
  const [revenue, setRevenue] = useState([]);
  // const orderList = useSelector((state: RootState) => state.order.orderList);
  // order list get from api
  const { user } = useAuth();
  const { translate } = useLocales();
  const [orderList, setOrderList] = useState<Order[]>();
  const [monthList, setMonthList] = useState<MonthList[]>();
  const [dataOrder, setDataOrder] = useState<number[] | any>();
  const handleChangeSeriesData = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSeriesData(Number(event.target.value));
  };

  const CHART_DATA = [
    // {
    //   year: 2019,
    //   data: [
    //     { name: 'ss', data: [2, 41, 35, 21, 49, 32, 69, 91, 128] },
    //     { name: 'Amerssica', data: [10, 34, 13, 54, 17, 88, 59, 77, 45] }
    //   ]
    // },
    {
      year: 2022,
      data: [
        // { name: 'Asia', data: [10, 41, 35, 51, 49, 62, 69, 91, 148] },
        { name: 'revenue', data: dataOrder }
      ]
    }
  ];

  const chartOptions = merge(BaseOptionChart(), {
    xaxis: {
      categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
    }
  });

  useEffect(() => {
    try {
      manageOrder.getListOrder(user?.siteid, -1, 1, '').then((response) => {
        if (response.status == 200) {
          // console.log(response.data.items);
          setOrderList(response.data.items);
        }
      });
    } catch (error) {
      // setOrderList([]);
    }
  }, [dispatch]);

  // useEffect when has OrderList
  useEffect(() => {
    sortOrder().then(() => {
      console.log(monthList);
    });
  }, [orderList]);

  useEffect(() => {
    const data2 = monthList?.map((mo: MonthList) => {
      let totalMonth = 0;
      mo.listOrder.map((order) => (totalMonth += order.total));
      return totalMonth;
    });
    setDataOrder(data2);
  }, [monthList]);

  const sortOrder = async () => {
    sortOrder2().then((list) => {
      setMonthList(list);
    });
  };

  const sortOrder2 = async () => {
    const list: MonthList[] = [
      { month: '1', listOrder: [] },
      { month: '2', listOrder: [] },
      { month: '3', listOrder: [] },
      { month: '4', listOrder: [] },
      { month: '5', listOrder: [] },
      { month: '6', listOrder: [] },
      { month: '7', listOrder: [] },
      { month: '8', listOrder: [] },
      { month: '9', listOrder: [] },
      { month: '10', listOrder: [] },
      { month: '11', listOrder: [] },
      { month: '12', listOrder: [] }
    ];

    const data: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    await orderList?.map((order: Order) => {
      // let total = 0;
      // total += order.total;
      // shoud take total of revenue here
      const d1 = new Date(order.createTime);
      list.map((mon, index) => {
        if (parseInt(mon.month, 10) == d1.getMonth() + 1) {
          mon.listOrder.push(order);
        }
      });
    });
    return list;
  };

  return (
    <Card>
      <CardHeader
        title={translate('dashboard.order.title')}
        subheader=""
        action={
          <TextField
            select
            fullWidth
            value={seriesData}
            SelectProps={{ native: true }}
            onChange={handleChangeSeriesData}
            sx={{
              '& fieldset': { border: '0 !important' },
              '& select': {
                pl: 1,
                py: 0.5,
                pr: '24px !important',
                typography: 'subtitle2'
              },
              '& .MuiOutlinedInput-root': {
                borderRadius: 0.75,
                bgcolor: 'background.neutral'
              },
              '& .MuiNativeSelect-icon': {
                top: 4,
                right: 0,
                width: 20,
                height: 20
              }
            }}
          >
            {CHART_DATA.map((option) => (
              <option key={option.year} value={option.year}>
                {option.year}
              </option>
            ))}
          </TextField>
        }
      />

      {CHART_DATA.map((item) => (
        <Box key={item.year} sx={{ mt: 3, mx: 3 }} dir="ltr">
          {item.year === seriesData && (
            <ReactApexChart type="line" series={item.data} options={chartOptions} height={364} />
          )}
        </Box>
      ))}
    </Card>
  );
}
