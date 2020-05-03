import React, { useState, Component } from "react"
import {
  Collapse,
  List,
  Spin,
  Avatar,
  Table,
  Input,
  Popconfirm,
  Button,
  Form,
  message,
  Select,
  Col,
  Row,
  Modal,
  Card,
  Tabs,
  Upload,
  Moda,
} from "antd"
import {
  EditTwoTone,
  DownOutlined,
  CaretUpOutlined,
  // PlusOutlined,
  MessageTwoTone,
  DeleteTwoTone,
} from "@ant-design/icons"
import { TheSlider } from "./TheSlider"
import img from "./1.jpg"
import { Search } from "./Search"
import articleService from "../../service/article"
import categoryService from "../../service/category"
import moment from "moment"
require("moment/locale/zh-cn.js")

export default class Article extends Component {
  state = {
    categories: [],
    items: [],
    loading: false,
    editVisible: false,
    commentVisible: false,
    isCreate: true,
    item: {},
    keyword: "",
    pagination: {},
    selectedRowkKeys: [],
  }
  componentDidMount() {
    categoryService
      .list({
        current: 1,
        pageSize: 10,
      })
      .then((res) => {
        if (res.code == 0) {
          this.setState({
            categories: res.data.items,
          })
        }
      })
    this.getList()
  }
  pageChange = (current) => {
    this.setState(
      {
        pagination: {
          ...this.state.pagination,
          current,
        },
      },
      this.getList
    )
  }
  getList = () => {
    this.setState({
      loading: true,
    })
    articleService
      .list({
        current: this.state.pagination.current,
        keyword: this.state.keyword,
      })
      .then((res) => {
        this.setState({
          loading: false,
        })

        if (res.code == 0) {
          const { items, pageNum: current, pageSize, total } = res.data
          this.setState({
            items: items.map(
              (item, index) => (
                ((item.index = index + 1), (item.key = item._id)), item
              )
            ),
            pagination: {
              current,
              pageSize,
              total,
              showQuickJumper: true,
              showTotal: (total) => `共计${total}条`,
              onChange: this.pageChange,
            },
          })
        } else {
          message.error(res.data)
        }
      })
  }
  create = () => {
    this.setState({
      title: "增加文章",
      editVisible: true,
      isCreate: true,
    })
  }
  editCancel = () => {
    this.setState({
      editVisible: false,
    })
  }
  editOk = () => {
    let article = this.editform.props.form.getFieldsValue()
    articleService[this.state.isCreate ? "create" : "update"](article).then(
      (res) => {
        if (res.code == 0) {
          this.setState(
            {
              editVisible: false,
            },
            this.getList
          )
        }
      }
    )
  }
  edit = (item) => {
    this.setState({
      editVisible: true,
      item,
      isCreate: false,
    })
  }
  view = (item) => {
    articleService.addPv(item._id).then((res) => {
      if (res.code == 0) {
        this.setState(
          {
            viewVisible: true,
            item,
          },
          this.getList
        )
      } else {
        message.error(res.data)
      }
    })
  }
  viewCancel = () => {
    this.setState({
      viewVisible: false,
    })
  }
  remove = (ids) => {
    articleService.remove(ids).then((res) => {
      if (res.code == 0) {
        this.setState({}, this.getList)
      }
    })
  }
  handleSearch = (keyword) => {
    this.setState(
      {
        keyword,
        pagination: {
          ...this.state.pagination,
          current: 1,
        },
      },
      this.getList
    )
  }
  commentOk = () => {
    let comment = this.commentForm.props.form.getFieldsValue()
    articleService.addComment(this.state.item._id, comment).then((res) => {
      if (res.code == 0) {
        this.setState(
          {
            commentVisible: false,
          },
          this.getList
        )
      } else {
        message.error(res.data)
      }
    })
  }
  commentCancel = () => {
    this.setState({
      commentVisible: false,
    })
  }
  comment = (item) => {
    this.setState({
      commentVisible: true,
      item,
    })
  }
  deleteComment = (article_id, comment_id) => {
    articleService.deleteComment(article_id, comment_id).then((res) => {
      if (res.code == 0) {
        if (res.code == 0) {
          this.setState(
            {
              commentVisible: false,
            },
            this.getList
          )
        } else {
          message.error(res.data)
        }
      }
    })
  }
  render() {
    let columns = [
      {
        title: "序号",
        dataIndex: "index",
        key: "index",
        width: 60,
        fixed: "left",
      },
      {
        title: "中文名称",
        dataIndex: "name",
        key: "name",
        render: (text, record) => (
          <a
            onClick={() => this.view(record)}
            className={"text-ellipsis"}
            title={text}
          >
            {text}
          </a>
        ),
      },
      {
        title: "英文名称",
        dataIndex: "nameEn",
        key: "nameEn",
        render: (text) => (
          <div className={"text-ellipsis"} title={text}>
            {text}
          </div>
        ),
      },
      {
        title: "中文描述",
        dataIndex: "descript",
        key: "descript",
        render: (text) => (
          <div className={"text-ellipsis"} title={text}>
            {text}
          </div>
        ),
      },
      {
        title: "英文描述",
        dataIndex: "descriptEn",
        key: "descriptEn",
        render: (text) => (
          <div className={"text-ellipsis"} title={text}>
            {text}
          </div>
        ),
      },
      {
        title: "内容",
        dataIndex: "content",
        key: "content",
        render: (text) => (
          <div className={"text-ellipsis"} title={text}>
            {text}
          </div>
        ),
      },
      {
        title: "分类",
        dataIndex: "category",
        key: "category",
        render: (text, record) => {
          return text && text.name
        },
      },
      {
        title: "标签",
        dataIndex: "tag",
        key: "tag",
        render: (text, record) => {
          return text && text.name
        },
      },
      {
        title: "阅读量",
        dataIndex: "pv",
        key: "pv",
      },
      { title: "创建者", dataIndex: "creator", key: "creator" },
      {
        title: "创建时间",
        dataIndex: "creatTime",
        key: "createAt",
        render: (text) => moment(text).fromNow(),
      },
      {
        title: "更新者",
        dataIndex: "updater",
        key: "updater",
      },
      {
        title: "更新时间",
        dataIndex: "updateTime",
        key: "updateTime",
        render: (text) => moment(text).fromNow(),
      },
      {
        title: "评论数",
        dataIndex: "comments",
        key: "comments",
        render: (text) => text.length,
      },
      {
        title: "操作",
        dataIndex: "action",
        key: "action",
        fixed: "right",
        render: (text, record, index) => {
          return (
            <div className="icons-list">
              <EditTwoTone onClick={() => this.edit(record)} />
              <MessageTwoTone
                onClick={() => this.comment(record)}
                style={{ marginLeft: "10px" }}
              />
              <Popconfirm onConfirm={() => this.remove(record._id)}>
                <DeleteTwoTone style={{ marginLeft: "10px" }} />
              </Popconfirm>
            </div>
          )
        },
      },
    ]
    let rowSelection = {
      onChange: (selectedRowkKeys) => {
        this.setState({
          selectedRowkKeys,
        })
      },
    }
    return (
      <div
        className="common-page"
        span="24"
        style={{
          padding: 8,
        }}
      >
        <Search className={"search"} />
        <Button.Group className={"button"}>
          <Button type="primary" icon="plus-circle" onClick={this.create}>
            添加
          </Button>
          <Button
            style={{
              marginLeft: 5,
            }}
            type="danger"
            icon="minus-circle"
            onClick={() => this.remove(this.state.selectedRowkKeys)}
          >
            删除
          </Button>
        </Button.Group>
        <Table
          className={"table"}
          loading={this.state.loading}
          columns={columns}
          scroll={{ x: 1500 }}
          dataSource={this.state.items}
          pagination={this.state.pagination}
          rowSelection={rowSelection}
        />
        <WrappedTheSlider
          visible={this.state.editVisible}
          categories={this.state.categories}
          title={this.state.title}
          isCreate={this.state.isCreate}
          item={this.state.item}
        />
        <Modal
          visible={this.state.editVisible}
          title={this.state.title}
          onCancel={this.editCancel}
          onOk={this.editOk}
          destroyOnClose
        >
          <WrappedEditModal
            wrappedComponentRef={(inst) => (this.editform = inst)}
            isCreate={this.state.isCreate}
            item={this.state.item}
            categories={this.state.categories}
          />
        </Modal>
        <Modal
          visible={this.state.viewVisible}
          footer={null}
          onCancel={this.viewCancel}
          destroyOnClose
        >
          <WrappedViewModal item={this.state.item} />
        </Modal>
        <Modal
          visible={this.state.commentVisible}
          onCancel={this.commentCancel}
          onOk={this.commentOk}
          destroyOnClose
        >
          <WrappedCommentModal
            wrappedComponentRef={(inst) => (this.commentForm = inst)}
            item={this.state.item}
            deleteComment={this.deleteComment}
          />
        </Modal>
      </div>
    )
  }
}
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [
      {
        uid: "-1",
        name: "image.png",
        status: "done",
        url: img,
      },
      {
        uid: "-2",
        name: "image.png",
        status: "done",
        url: img,
      },
      {
        uid: "-3",
        name: "image.png",
        status: "done",
        url: img,
      },
      {
        uid: "-4",
        name: "image.png",
        status: "done",
        url: img,
      },
      {
        uid: "-5",
        name: "image.png",
        status: "error",
      },
    ],
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    })
  }

  handleChange = ({ fileList }) => this.setState({ fileList })

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state
    const uploadButton = (
      <div>
        {/* <PlusOutlined /> */}
        <div className="ant-upload-text">Upload</div>
      </div>
    )
    return (
      <div className="clearfix">
        <Upload
          action="http://127.0.0.1:7001/api/file/upload"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}
class EditModal extends Component {
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form>
        <Form.Item>
          {getFieldDecorator("name", {
            initialValue: this.props.isCreate ? "" : this.props.item.name,
            rules: [
              {
                required: true,
                message: "请输入中文名称",
              },
            ],
          })(<Input placeholder="请输入中文名称" />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("nameEn", {
            initialValue: this.props.isCreate ? "" : this.props.item.nameEn,
            rules: [
              {
                required: true,
                message: "请输入英文名称",
              },
            ],
          })(<Input placeholder="请输入英文名称" />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("descript", {
            initialValue: this.props.isCreate ? "" : this.props.item.descript,
            rules: [
              {
                required: true,
                message: "请输入中文描述",
              },
            ],
          })(<Input.TextArea placeholder="请输入中文描述" />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("descriptEn", {
            initialValue: this.props.isCreate ? "" : this.props.item.descriptEn,
            rules: [
              {
                required: true,
                message: "请输入英文描述",
              },
            ],
          })(<Input.TextArea placeholder="请输入英文描述" />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("category", {
            initialValue: this.props.isCreate
              ? this.props.categories[0]._id
              : this.props.item.title,
            rules: [
              {
                required: true,
                message: "请输入标题",
              },
            ],
          })(
            <Select placeholder="请输入标题">
              {this.props.categories.map((item) => (
                <Select.Option key={item._id} value={item._id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("content", {
            initialValue: this.props.isCreate ? "" : this.props.item.content,
            rules: [
              {
                required: true,
                message: "请输入内容",
              },
            ],
          })(<Input.TextArea placeholder="请输入内容" />)}
        </Form.Item>
        {!this.isCreate && (
          <Form.Item>
            {getFieldDecorator("id", {
              initialValue: this.props.item._id,
            })(<Input type="hidden" />)}
          </Form.Item>
        )}
      </Form>
    )
  }
}
class ViewModal extends Component {
  render() {
    return (
      <Card
        title="查看文章"
        style={{
          marginTop: 20,
        }}
      >
        <p> 标题： {this.props.item.title} </p>
        <p> 内容： {this.props.item.content} </p>
        <PicturesWall />
      </Card>
    )
  }
}
class CommentModal extends Component {
  state = {
    start: 0,
    limit: 5,
    loading: false,
    comments: this.props.item.comments.slice(0, 5),
  }
  loading = () => {
    this.setState({
      loading: true,
    })
    setTimeout(() => {
      this.setState(
        {
          start: this.state.start + this.state.limit,
        },
        () => {
          this.setState({
            loading: false,
            comments: this.props.item.comments.slice(
              0,
              this.state.start + this.state.limit
            ),
          })
        }
      )
    }, 2000)
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const loadMore = this.state.start + this.state.limit <
      this.props.item.comments.length && (
      <div
        style={{
          marginTop: 20,
          textAlign: "center",
        }}
      >
        {this.state.loading ? (
          <Spin />
        ) : (
          <Button onClick={this.loadMore}> 加载更多 </Button>
        )}
      </div>
    )
    return (
      <Row
        style={{
          marginTop: 15,
        }}
      >
        <Col span="24">
          <Form>
            <Form.Item>
              {getFieldDecorator("content")(
                <Input placeholder="请输入评论内容" />
              )}
            </Form.Item>
          </Form>
          <List
            loading={this.state.loading}
            dataSource={this.state.comments}
            loadMore={loadMore}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    onClick={() =>
                      this.props.deleteComment(this.props.item._id, item._id)
                    }
                    type="danger"
                    icon="delete"
                  >
                    删除
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                  }
                  title={item.user.username}
                  description={item.user.email}
                />
                <div> {item.content} </div>
              </List.Item>
            )}
          />
        </Col>
      </Row>
    )
  }
}

const WrappedTheSlider = Form.create()(TheSlider)
const WrappedEditModal = Form.create()(EditModal)
const WrappedViewModal = Form.create()(ViewModal)
const WrappedCommentModal = Form.create()(CommentModal)
