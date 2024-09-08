import { Query } from "mongoose";
import { apiFeatures } from "../interfaces/features.interface";

export class ApiFeatures {
  constructor(public query: Query<any[], any>, private reqQuery: apiFeatures) {}

  productPaginate(pageSize: number = 35) {
    let page: number = Number(this.reqQuery?.page) || 1;

    if (page < 1) page = 1;

    this.query = this.query.skip((page - 1) * pageSize).limit(pageSize);

    return this;
  }

  paginate(pageSize: number = 5) {
    let page: number = Number(this.reqQuery?.page) || 1;

    if (page < 1) page = 1;

    this.query = this.query.skip((page - 1) * pageSize).limit(pageSize);

    return this;
  }

  filter() {
    const filterFields: Record<string, any> = { ...this.reqQuery };
    const exclusionList: string[] = [
      "page",
      "sort",
      "keyword",
      "fields",
      "dir",
    ];
    exclusionList.forEach((item) => {
      delete filterFields[item];
    });
    const filterFieldsString: string = JSON.stringify(filterFields);
    const modifiedFilterFieldsString: string = filterFieldsString.replace(
      /(lt|lte|gt|gte)/g,
      (match) => `$${match}`
    );
    const modifiedFilterFields: Record<string, any> = JSON.parse(
      modifiedFilterFieldsString
    );
    this.query.find(modifiedFilterFields);
    return this;
  }

  sort() {
    if (this.reqQuery.sort) {
      const sortBy = this.reqQuery.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  search(fieldsToSearch: string[]) {
    if (!this.reqQuery.keyword) return this;

    const regex: RegExp = new RegExp(this.reqQuery.keyword, "i");

    const regexQuery: { $or: { [key: string]: RegExp }[] } = {
      $or: fieldsToSearch.map((field: string) => ({
        [field]: regex,
      })),
    };

    this.query.find(regexQuery);

    return this;
  }

  fields() {
    if (!this.reqQuery.fields) return this;
    this.query.select(this.reqQuery.fields.split(","));
    return this;
  }
}
