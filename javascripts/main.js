$(function() {

    var githubName = 'frontinside', // github用户名
        repoName = 'frontinside.github.com', // 仓库名
        issueUrl = 'https://api.github.com/repos/' + githubName + '/' + repoName + '/issues';

    // 自定义模板方法，from kissy
    function substitute(str, o, regexp) {
        if (typeof str !== 'string' || !o) {
            return str;
        }

        var SUBSTITUTE_REG = /\\?\{([^{}]+)\}/g,
            EMPTY = '';

        return str.replace(regexp || SUBSTITUTE_REG, function (match, name) {
            if (match.charAt(0) === '\\') {
                return match.slice(1);
            }
            return (o[name] === undefined) ? EMPTY : o[name];
        });
    }

    // 修正获取的时间
    function modifyTime(str) {
        return str.slice(0, str.indexOf('T'));
    }

    $.getJSON(issueUrl, function(data) {

        var list = '';

        for (var i = 0, dataLength = data.length; i < dataLength; i++) {
            var tpl = $('#article-tpl').html(),
                issue= {};

            issue.url = data[i].html_url;
            issue.title = data[i].title;
            issue.time = modifyTime(data[i].created_at);
            issue.html = markdown.toHTML(data[i].body);
            issue.describe = data[i].body.substring(0,200);
            issue.tags = '';

            // get tags
            for (var j = 0, labelLength = data[i].labels.length; j < labelLength; j++) {
                var comma = j === (labelLength - 1)? '': '，';
                issue.tags += data[i].labels[j].name + comma;
            }

            list += substitute(tpl, issue);
        }

        $('.article-list').html(list);
    });

});
