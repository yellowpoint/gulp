var appName = '51loan';
module.exports = {
    version: '1.0.0',
    env: '51loan server',
    //上传配置
    // ssh: {
    //     host: '120.26.112.213',
    //     port: 22,
    //     username: 'root',
    //     password: 'Wcl20150312www51appcn',
    // },
    ssh: {
        host: '192.168.1.249',
        port: 22,
        username: 'root',
        password: 'jiaotashidi',
    },
    remoteDir: '/data/project/diyMallAPP/51loan',
    commands: [
        //删除现有文件
        // 'rm -rf /data/project/diyMallAPP/51loa/'

    ]
};