import path from "path";
import Generator from "yeoman-generator";
import staticFiles from "./staticFiles";

export default class AppGenerator extends Generator {
  constructor(args: string | string[], opts: Generator.GeneratorOptions) {
    super(args, opts);
    this.sourceRoot(path.resolve(__dirname, "../templates"));
  }

  copyStaticFiles(): void {
    for(const file of staticFiles) {
      this.fs.copy(
        this.templatePath(file),
        this.destinationPath(file),
      );
    }
  }

  async pkgJson(): Promise<void> {
    const answer = await this.prompt([
      {
        type: "input",
        name: "projectName",
        message: "请输入项目名",
        validate: function (value: string) {
          if((/^[a-zA-Z0-9\/\-@]+$/g).test(value)) {
            return true;
          }
          return "项目名只能包含以下字符: \"@\"  \"/\"  \"-\" \"a-zA-Z\" \"0-9\"";
        },
      }
    ]);
    const projectName = answer.projectName;
    this.fs.copyTpl(
      this.templatePath("package.json.template"),
      this.destinationPath("package.json"),
      { projectName: projectName }
    );
    this.fs.copyTpl(
      this.templatePath("package-lock.json.template"),
      this.destinationPath("package-lock.json"),
      { projectName: projectName }
    );
  }

  async serviceConfig(): Promise<void> {
    let serviceName = "",
        useProcessIDAsServiceID = true,
        customServiceID = "";

    // 询问服务名
    const serviceNameAns = await this.prompt({
      type: "input",
      name: "serviceName",
      message: "请输入服务名",
      validate: function (value: string) {
        if((/^[a-zA-Z\-_]+$/g).test(value)) {
          return true;
        }
        return "服务名只能包含以下字符: \"-\" \"_\" \"a-zA-Z\"";
      },
    });
    serviceName = serviceNameAns.serviceName;
    // 询问服务id的类型
    const serviceIdTypeAns = await this.prompt({
      type: "list",
      name: "serviceIdType",
      message: "服务ID的类型",
      choices: [
        {
          name: "使用进程ID作为服务ID(单主机多实例)",
          value: "pid"
        },
        {
          name: "使用固定值作为服务ID(跨主机、分布式)",
          value: "custom"
        }
      ],
      default: "pid",
      loop: true
    });
    if(serviceIdTypeAns.serviceIdType === "custom") {
      const serviceIDAns = await this.prompt({
        type: "input",
        name: "serviceID",
        message: "请输入服务ID"
      });
      customServiceID = serviceIDAns.serviceID;
      useProcessIDAsServiceID = false;
    } else if(serviceIdTypeAns.serviceIdType === "pid") {
      useProcessIDAsServiceID = true;
    }
    this.fs.copyTpl(
      this.templatePath(".env"),
      this.destinationPath(".env"),
      { serviceName, useProcessIDAsServiceID, customServiceID }
    );
  }

  npmIns(): void {
    this.installDependencies({
      yarn: false,
      bower: false,
      npm: true
    });
  }

  complete(): void {
    this.log("项目创建完毕 ✔️");
  }
}
