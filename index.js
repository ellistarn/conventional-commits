"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __importDefault(require("@actions/core"));
const github_1 = __importDefault(require("@actions/github"));
const parser_1 = require("@conventional-commits/parser");
const process_1 = require("process");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        core_1.default.info('🤨 Validating conventional commits');
        if (github_1.default.context.eventName === 'push') {
            validatePush(github_1.default.context.payload);
        }
        if (github_1.default.context.eventName == 'pull_request') {
            validatePullRequest(github_1.default.context.payload);
        }
        core_1.default.info('🎉 Success');
    });
}
function validatePush(event) {
    validateCommits(event.commits);
}
function validatePullRequest(event) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield github_1.default.getOctokit(process_1.env.GITHUB_TOKEN || "").request(event.pull_request.commits_url);
        let commitResponse = response.data;
        let commits = commitResponse.map((response) => { return response.commit; });
        validateCommits(commits);
    });
}
function validateCommits(commits) {
    commits.forEach((commit) => {
        try {
            (0, parser_1.parser)(commit.message);
            core_1.default.info(`✅ ${commit.message}`);
        }
        catch (error) {
            core_1.default.error(`❌ ${commit.message}`);
            core_1.default.setFailed(error);
        }
    });
}
run();
