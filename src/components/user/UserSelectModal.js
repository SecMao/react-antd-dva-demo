/**
 * Created by Sec on 2017/3/25.
 */
import React, {PropTypes} from 'react';
import {Modal, Transfer, Row, Col} from 'antd';
import SearchPanel from '../common/SearchPanel';
import OrgTreePanel from '../organization/OrgTreePanel';

class UserSelectModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      targetKeys: [],
      targetUsers: [],
      selectedKeys: []
    };
  }

  // 初始化数据
  componentWillMount() {
    // this.props.defaultParams
    // this.onSearchUser(params)
    // const {defaultTargets, dataSource} = this.props;
    // this.setState(prevState => {
    //   return {
    //     targetKeys: defaultTargets,
    //     targetUsers: dataSource.filter(user => defaultTargets.includes(user.id))
    //   }
    // });
  }

  // 接收传入数据
  componentWillReceiveProps(nextProps) {
    const {defaultTargets, dataSource} = nextProps;
    const {defaultTargets: lastTargetUsers} = this.props;
    if (!defaultTargets || (defaultTargets === lastTargetUsers)) {
      return;
    }
    this.setState({
      targetKeys: defaultTargets,
      targetUsers: dataSource.filter(user => defaultTargets.includes(user.id))
    });
  }

  onSearchUser = params => {

  };

  /**
   * 数据移动事件
   * @param targetKeys 右侧数据集
   * @param direction 移动方向
   * @param moveKeys 移动数据集
   */
  handleChange = (targetKeys, direction, moveKeys) => {
    this.setState(prevState => {
      let targetUsers = [];
      // 向右移动则添加到目标用户组
      if (direction === "right") {
        targetUsers = [...prevState.targetUsers, ...this.props.dataSource.filter(user => moveKeys.includes(user.id))];
      } else {// 向左移动则从目标用户组移除
        targetUsers = prevState.targetUsers.filter(user => !moveKeys.includes(user.id));
      }
      return {
        targetKeys: targetKeys,
        targetUsers
      };
    });
  };

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys]});
  };

  /**
   * 返回目标用户集
   */
  returnTargetUsers = () => {
    this.props.getSelectedUsers(this.state.targetUsers);
  };

  render() {
    const {dataSource, modalVisible, dictData, onHideModal, defaultParams} = this.props;
    const {targetKeys, selectedKeys} = this.state;
    const searchFields = [{
      name: 'userAccount',
      label: '账号',
      type: 'Input',
      options: {}
    }, {
      name: 'userName',
      label: '姓名',
      type: 'Input',
      options: {}
    }, {
      name: 'userType',
      label: '用户类型',
      type: 'Select',
      options: {
        dictData: dictData['userType'] ? dictData['userType'] : {}
      }
    }];

    return (
      <Modal visible={modalVisible} width="900px" title="用户选择" onOk={this.returnTargetUsers}
             onCancel={onHideModal}>
        <Row gutter={2}>
          <Col span={6}>
            <OrgTreePanel editable={false} defaultRootKey={defaultParams.org ? defaultParams.org.id : '-1'}
                          minBodyHeight="335px"
                          onOrgSelect={selectedKeys => this.onSearchUser({org: {id: selectedKeys[0]}})}/>
          </Col>
          <Col span={18}>
            <SearchPanel fields={searchFields} maxCols={3} onSearch={this.onSearchUser}/>
            <Transfer listStyle={{width: '290px', height: '250px'}} rowKey={record => record.id}
                      dataSource={dataSource} titles={['待选用户', '已选用户']} operations={['选择', '移除']}
                      targetKeys={targetKeys} selectedKeys={selectedKeys}
                      onChange={this.handleChange} onSelectChange={this.handleSelectChange}
                      render={item => item.userName}/>
          </Col>
        </Row>
      </Modal>
    );
  }
}

UserSelectModal.propTypes = {
  modalVisible: PropTypes.bool.isRequired,
  getSelectedUsers: PropTypes.func.isRequired,
  onHideModal: PropTypes.func.isRequired,
  defaultParams: PropTypes.object,
  defaultTargets: PropTypes.array
};

export default UserSelectModal;

