"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiFeatures = void 0;
class ApiFeatures {
    constructor(query, reqQuery) {
        this.query = query;
        this.reqQuery = reqQuery;
    }
    productPaginate(pageSize = 35) {
        var _a;
        let page = Number((_a = this.reqQuery) === null || _a === void 0 ? void 0 : _a.page) || 1;
        if (page < 1)
            page = 1;
        this.query = this.query.skip((page - 1) * pageSize).limit(pageSize);
        return this;
    }
    paginate(pageSize = 5) {
        var _a;
        let page = Number((_a = this.reqQuery) === null || _a === void 0 ? void 0 : _a.page) || 1;
        if (page < 1)
            page = 1;
        this.query = this.query.skip((page - 1) * pageSize).limit(pageSize);
        return this;
    }
    filter() {
        const filterFields = Object.assign({}, this.reqQuery);
        const exclusionList = [
            "page",
            "sort",
            "keyword",
            "fields",
            "dir",
        ];
        exclusionList.forEach((item) => {
            delete filterFields[item];
        });
        const filterFieldsString = JSON.stringify(filterFields);
        const modifiedFilterFieldsString = filterFieldsString.replace(/(lt|lte|gt|gte)/g, (match) => `$${match}`);
        const modifiedFilterFields = JSON.parse(modifiedFilterFieldsString);
        this.query.find(modifiedFilterFields);
        return this;
    }
    sort() {
        if (this.reqQuery.sort) {
            const sortBy = this.reqQuery.sort.split(",").join(" ");
            this.query = this.query.sort(sortBy);
        }
        else {
            this.query = this.query.sort("-createdAt");
        }
        return this;
    }
    search(fieldsToSearch) {
        if (!this.reqQuery.keyword)
            return this;
        const regex = new RegExp(this.reqQuery.keyword, "i");
        const regexQuery = {
            $or: fieldsToSearch.map((field) => ({
                [field]: regex,
            })),
        };
        this.query.find(regexQuery);
        return this;
    }
    fields() {
        if (!this.reqQuery.fields)
            return this;
        this.query.select(this.reqQuery.fields.split(","));
        return this;
    }
}
exports.ApiFeatures = ApiFeatures;
