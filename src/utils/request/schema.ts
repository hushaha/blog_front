import { BlogItem } from "@/types";

import { APISchemaType, ApiType } from "./type";

export interface APISchemas extends APISchemaType {
  login: {
    request: {
      name: string;
      password: string;
    };
    response: string;
  };
  register: {
    request: {
      name: string;
      password: string;
    };
    response: string;
  };
  getBlogList: {
    request: {
      title?: string;
    };
    response: {
      list: BlogItem[];
      total: number;
    };
  };
  getBlog: {
    request: {
      id: string;
    };
    response: BlogItem;
  };
  addBlog: {
    request: {
      title: string;
      content: string;
      isDrafts: boolean;
    };
    response: {
      id: number;
      name: string;
    };
  };
}

export const apis: ApiType<APISchemas> = {
  login: {
    path: "POST login",
  },
  register: {
    path: "POST register",
  },
  getBlogList: {
    path: "POST blog/list",
  },
  getBlog: {
    path: "GET blog/:id",
  },
  addBlog: {
    path: "POST blog/add",
  },
};
