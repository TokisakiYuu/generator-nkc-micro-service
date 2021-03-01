"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _yeomanGenerator = _interopRequireDefault(require("yeoman-generator"));

var _staticFiles = _interopRequireDefault(require("./staticFiles"));

class AppGenerator extends _yeomanGenerator.default {
  constructor(args, opts) {
    super(args, opts);
    this.sourceRoot(_path.default.resolve(__dirname, "../templates"));
  }

  copyStaticFiles() {
    for (const file of _staticFiles.default) {
      this.fs.copy(this.templatePath(file), this.destinationPath(file));
    }

    this.fs.copyTpl(this.templatePath(".gitignore.template"), this.destinationPath(".gitignore"));
  }

  async pkgJson() {
    const answer = await this.prompt([{
      type: "input",
      name: "projectName",
      message: "请输入项目名",
      validate: function (value) {
        if (/^[a-zA-Z0-9\/\-@]+$/g.test(value)) {
          return true;
        }

        return "项目名只能包含以下字符: \"@\"  \"/\"  \"-\" \"a-zA-Z\" \"0-9\"";
      }
    }]);
    const projectName = answer.projectName;
    this.fs.copyTpl(this.templatePath("package.json.template"), this.destinationPath("package.json"), {
      projectName: projectName
    });
    this.fs.copyTpl(this.templatePath("package-lock.json.template"), this.destinationPath("package-lock.json"), {
      projectName: projectName
    });
  }

  async serviceConfig() {
    let serviceName = "",
        useProcessIDAsServiceID = true,
        customServiceID = ""; // 询问服务名

    const serviceNameAns = await this.prompt({
      type: "input",
      name: "serviceName",
      message: "请输入服务名",
      validate: function (value) {
        if (/^[a-zA-Z\-_]+$/g.test(value)) {
          return true;
        }

        return "服务名只能包含以下字符: \"-\" \"_\" \"a-zA-Z\"";
      }
    });
    serviceName = serviceNameAns.serviceName; // 询问服务id的类型

    const serviceIdTypeAns = await this.prompt({
      type: "list",
      name: "serviceIdType",
      message: "服务ID的类型",
      choices: [{
        name: "使用进程ID作为服务ID(单主机多实例)",
        value: "pid"
      }, {
        name: "使用固定值作为服务ID(跨主机、分布式)",
        value: "custom"
      }],
      default: "pid",
      loop: true
    });

    if (serviceIdTypeAns.serviceIdType === "custom") {
      const serviceIDAns = await this.prompt({
        type: "input",
        name: "serviceID",
        message: "请输入服务ID"
      });
      customServiceID = serviceIDAns.serviceID;
      useProcessIDAsServiceID = false;
    } else if (serviceIdTypeAns.serviceIdType === "pid") {
      useProcessIDAsServiceID = true;
    }

    this.fs.copyTpl(this.templatePath(".env"), this.destinationPath(".env"), {
      serviceName,
      useProcessIDAsServiceID,
      customServiceID
    });
  }

  npmIns() {
    this.installDependencies({
      yarn: false,
      bower: false,
      npm: true
    });
  }

  complete() {
    this.log("项目创建完毕 ✔️");
  }

}

exports.default = AppGenerator;
//# sourceMappingURL=index.js.map