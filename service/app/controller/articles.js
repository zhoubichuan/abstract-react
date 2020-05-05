/**
 * Created by Administrator on 2018/5/15.
 */
'use strict';
const BaseController = require('./base');

module.exports = class ArticlesController extends BaseController {
  async index() {
    try {
      await this.getPager({
        modName: 'Article',
        returnFiles: ['titlt', 'content'],
        populateFields: ['category', 'user', 'comments.user'],
      });
    } catch (error) {
      this.error(error);
    }
  }
  async search() {
    try {
      await this.getPager({
        modName: 'Article',
        returnFiles: ['titlt', 'content'],
        populateFields: ['category', 'user', 'comments.user'],
      });
    } catch (error) {
      this.error(error);
    }
  }
  async create() {
    const {
      ctx,
    } = this;
    let article = ctx.request.body;
    article.creater = this.user;
    article.updater = this.user;
    try {
      article = await ctx.model.Article.create(article);
      this.success('文章发表成功');
    } catch (error) {
      this.error(error);
    }
  }
  async update() {
    const {
      ctx,
    } = this;
    const id = ctx.params.id;
    const article = ctx.request.body;
    article.updater = this.user;
    try {
      await ctx.model.Article.findByIdAndUpdate(id, article);
      this.success('更新成功');
    } catch (error) {
      this.error(error);
    }
  }
  async destroy() {
    const {
      ctx,
    } = this;
    const id = ctx.params.id;
    const {
      ids = [],
    } = ctx.request.body;
    ids.push(id);
    try {
      await ctx.model.Article.remove({
        _id: {
          $in: ids,
        },
      });
      this.success('删除成功');
    } catch (error) {
      this.error(error);
    }
  }
  async addPv() {
    const {
      ctx,
    } = this;
    const id = ctx.params.id;
    try {
      await ctx.model.Article.findByIdAndUpdate(id, {
        $inc: {
          pv: 1,
        },
      });
      this.success('修改pv成功');
    } catch (error) {
      this.error(error);
    }
  }
  async addComment() {
    const {
      ctx,
    } = this;
    const id = ctx.params.id;
    const comment = ctx.request.body;
    comment.user = this.user;
    console.log('用户名：' + this.user);
    try {
      await ctx.model.Article.findByIdAndUpdate(id, {
        $push: {
          comments: comment,
        },
      });
      this.success('评论成功');
    } catch (error) {
      this.error(error);
    }
  }
  async removeComment() {
    const {
      ctx,
    } = this;
    const {
      article_id,
      comment_id,
    } = ctx.params;
    try {
      await ctx.model.Article.findByIdAndUpdate(article_id, {
        $pull: {
          comment: {
            _id: comment_id,
          },
        },
      });
      this.success('删除评论成功');
    } catch (error) {
      this.error(error);
    }
  }
};