import React from 'react';
// import Link from 'umi/link';
import { Card, Spin, Button } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';

import CTable from '@/components/Clemon/CTable';
import CEmptyPlaceholder from '@/components/Clemon/CEmptyPlaceholder';
import { queryPurchases } from '@/services/storage/purchase';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { renderTagCol } from '@/utils/utils';

const tableColumns = [
  {
    title: formatMessage({ id: 'id' }),
    dataIndex: 'id',
  },
  {
    title: formatMessage({ id: 'orderId' }),
    dataIndex: 'orderId',
  },
  {
    title: formatMessage({ id: 'productName' }),
    dataIndex: 'productName',
  },
  {
    title: formatMessage({ id: 'productId' }),
    dataIndex: 'productId',
  },
  {
    title: formatMessage({ id: 'unitPrice' }),
    dataIndex: 'unitPrice',
  },
  {
    title: formatMessage({ id: 'unit' }),
    dataIndex: 'unit',
    render: data => renderTagCol({ data, type: 'tag' }),
  },
  {
    title: formatMessage({ id: 'amount' }),
    dataIndex: 'amount',
  },
  {
    title: formatMessage({ id: 'supplier' }),
    dataIndex: 'supplier',
  },
  {
    title: formatMessage({ id: 'supplierId' }),
    dataIndex: 'supplierId',
  },
  {
    title: formatMessage({ id: 'totalAmount' }),
    dataIndex: 'totalAmount',
  },
  {
    title: formatMessage({ id: 'status' }),
    dataIndex: 'status',
  },
];

// search: id, name, type, phone
// export
// tabs
// actions: edit, more
// inline edit
class Customer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      PList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      loading: false,
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  componentDidUpdate(prevProps, prevState) {
    const { pagination } = this.state;
    const { pagination: prevPagination } = prevState;
    if (
      pagination.current !== prevPagination.current ||
      pagination.pageSize !== prevPagination.pageSize
    ) {
      this.refreshList();
    }
  }

  handleTableChange = newPagination => {
    this.setState(prevState => ({
      pagination: {
        ...prevState.pagination,
        current: newPagination.current,
        pageSize: newPagination.pageSize,
      },
    }));
  };

  refreshList() {
    const { pagination } = this.state;
    this.setState({ loading: true });
    queryPurchases({
      page: pagination.current - 1,
      size: pagination.pageSize,
      sort: 'createdDate,desc',
    })
      .then(resp => {
        this.setState(prevState => ({
          PList: resp.content,
          pagination: { ...prevState.pagination, total: resp.totalElements },
          loading: false,
        }));
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }

  render() {
    const { PList, pagination, loading } = this.state;

    // rowSelection object indicates the need for row selection
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };

    return (
      <PageHeaderWrapper>
        <Card
          bordered={false}
          title={
            <Button
              icon="plus"
              type="primary"
              // onClick={() => this.handleModalVisible(true)}
            >
              <FormattedMessage id="create" />
            </Button>
          }
        >
          <Spin spinning={loading}>
            {!loading && PList.length === 0 ? (
              <CEmptyPlaceholder showIcon />
            ) : (
              <CTable
                dataSource={PList}
                pagination={pagination}
                columns={tableColumns}
                rowSelection={rowSelection}
                onChange={this.handleTableChange}
              />
            )}
          </Spin>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Customer;
