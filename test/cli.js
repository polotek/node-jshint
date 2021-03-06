var sys = require('sys'),
    fs = require('fs'),
    cli = require('./../lib/cli'),
    hint = require('./../lib/hint');

describe("cli", function () {

    beforeEach(function () {
        spyOn(hint, "hint");
    });

    it("interprets --help with no args", function () {
        var txt = require('fs').readFileSync(__dirname + "/../HELP", "utf-8");

        spyOn(sys, "print");

        cli.interpret(["node", "file.js"]);

        expect(sys.print.mostRecentCall.args[0]).toEqual(txt);
    });

    it("interprets --help", function () {
        var txt = require('fs').readFileSync(__dirname + "/../HELP", "utf-8");

        spyOn(sys, "print");

        cli.interpret(["node", "file.js", "--help"]);

        expect(sys.print.mostRecentCall.args[0]).toEqual(txt);
    });

    it("interprets --config", function () {
        var config = {};

        spyOn(fs, "readFileSync").andReturn("data");
        spyOn(JSON, "parse").andReturn(config);
        spyOn(sys, "print");

        cli.interpret(["node", "file.js", "file.js", "--config", "file.json"]);

        expect(fs.readFileSync).toHaveBeenCalledWith("file.json", "utf-8");
        expect(JSON.parse).toHaveBeenCalledWith("data");
        expect(hint.hint.mostRecentCall.args[0]).toContain("file.js");
        expect(hint.hint.mostRecentCall.args[1]).toEqual(config);
    });

    it("interprets --reporter", function () {
        var reporter = "function reporter() {}";

        spyOn(fs, "readFileSync").andReturn(reporter);

        cli.interpret(["node", "file.js", "file.js", "--reporter", "reporter.js"]);

        expect(fs.readFileSync).toHaveBeenCalledWith("reporter.js", "utf-8");
        expect(hint.hint.mostRecentCall.args[2].toString()).toEqual(reporter);
    });

    // TODO: handles config file open error

});
