import { Divider, List, Table } from "antd";

export function History({ instances }) {
  return (
    <Table dataSource={instances.toJS()} rowKey="id">
      <Table.Column title="#" dataIndex="id" key="id" />
      <Table.Column
        title="Winning Number"
        dataIndex="state.winningNumber"
        key="winningNumber"
      />
      <Table.Column
        title="Winning Type"
        dataIndex="state.winningType"
        key="winningType"
      />
      <Table.Column
        title="Server Seed"
        dataIndex="serverSeed"
        key="serverSeed"
      />
      <Table.Column
        title="Client Seed"
        dataIndex="clientSeed"
        key="clientSeed"
      />
      <Table.Column
        title="Verify"
        key="action"
        render={(text, record) => (
          <span>
            <a>Verify</a>
          </span>
        )}
      />
    </Table>
  );
}
