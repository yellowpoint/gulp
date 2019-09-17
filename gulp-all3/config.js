var appName = '51loan';
module.exports = {
    version: '1.0.0',
    env: '51loan server',
    // 源文件目录 已gulpfile.js同一级开始
    sourceSrc:'./src',
    // sourceSrc:'./coding/loan/v1',
    //上传配置
    ssh: {
        host: '120.26.112.213',
        port: 22,
        username: 'root',
        password: 'Wcl20150312www51appcn',
    },

    remoteDir: '/uq/app/loan/loanpage/v1.0.0',
    remoteTestDir: '/uq/app/loan/loanpage/test'

};