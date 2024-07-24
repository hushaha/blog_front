import dayjs from "dayjs";
import fs from "fs";
import path from "path";

import { BlogItem, TagItem } from "@/types";

class StaticData {
  constructor() {}

  private root = process.cwd();

  private cacheObj = new Map();

  // 匹配md文档配置正则
  private transConfigRegx = /---\r?\n([\s\S]*)\r?\n---/;

  private getCache(key: string) {
    if (this.cacheObj.has(key)) {
      return this.cacheObj.get(key);
    }
    return null;
  }

  private setCache(key: string, value: any) {
    this.cacheObj.set(key, value);
  }

  private getFolderPath(folder = "blog") {
    return path.join(this.root, `data/${folder}`);
  }

  private getFolderByName(folder = "blog") {
    return fs.readdirSync(this.getFolderPath(folder), "utf-8");
  }

  private getFileByName(folder = "blog", name: string) {
    return fs.readFileSync(
      path.join(this.getFolderPath(folder), name),
      "utf-8",
    );
  }

  private getFileId(name: string) {
    return name.split(".").slice(0, -1).join(".");
  }

  private getMDConfig(file: string) {
    return file.match(this.transConfigRegx)?.[1]?.split(/\r?\n/);
  }

  private getMDContent(file: string) {
    return file.replace(this.transConfigRegx, "");
  }

  /**
   * 获取md文档解析字符串
   * @param file 整个文档内容
   * @returns {string}
   */
  private getMDDesc(file: string): string {
    return this.getMDContent(file)?.replace(/[\n \*#`-]/g, "");
  }

  /**
   * 将md文档解析字符串提出配置信息
   * @param {string} id
   * @returns {BlogItem}
   */
  private getMdConfigById(id: string): BlogItem {
    try {
      const file = this.getFileByName("blog", `${id}.md`);
      const configList = this.getMDConfig(file) || [];
      const content = this.getMDContent(file);
      const fileConfig = {
        id,
        title: "",
        content,
        createTime: "",
        updateTime: "",
        desc: this.getMDDesc(content).slice(0, 100),
      };

      return configList.reduce((acc, cur) => {
        let [key, value] = cur.split(":");

        if (key === "tag") {
          value = value.replaceAll(" ", "");
        }

        acc[key.trim()] = value.trim();
        return acc;
      }, fileConfig);
    } catch (error) {
      return null;
    }
  }

  /**
   * 获取博客列表
   * @returns {BlogItem[]}
   */
  getBlogList(): BlogItem[] {
    if (this.getCache("blogList")) {
      return this.getCache("blogList");
    }

    const folder = this.getFolderByName("blog");
    const blogList = folder
      .map((name) => this.getMdConfigById(this.getFileId(name)))
      .filter((it) => !it.isDrafts)
      .sort((a, b) => {
        return dayjs(b.createTime).valueOf() - dayjs(a.createTime).valueOf();
      });

    this.setCache("blogList", blogList);
    return blogList;
  }

  /**
   * 获取博客详情
   * @param {string} id
   * @returns {BlogItem}
   */
  getBlogDetailById(id: string): BlogItem {
    const md = this.getMdConfigById(id);
    return md;
  }

  /**
   * 获取标签list
   * @returns {BlogItem[]}
   */
  getTagList(): TagItem[] {
    const blogs = this.getBlogList();
    return blogs.reduce((arr, blog) => {
      if (blog.tag) {
        const tags = blog.tag.split(",");
        tags.forEach((tag) => {
          const tagItem = arr.find((item) => item.name === tag);
          if (tagItem) {
            tagItem.count++;
          } else {
            arr.push({
              name: tag,
              count: 1,
            });
          }
        });
      }
      return arr;
    }, []);
  }
}

const staticData = new StaticData();
export default staticData;
