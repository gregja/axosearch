const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const port = 8081;

const filewalker = require('./diriterator.js').filewalker;
const getExtension = require('./diriterator.js').getExtension;
const getFileContents = require('./diriterator.js').getFileContents;

var search_path = "/home/gregja/Documents/axoloti_works"; // personalize the path

function checkStringOccurs(haystack, needle) {
    return haystack.indexOf(needle) != -1 ? true : false;
}

function searchFiles(res, params, callback) {
    var searchdata = params.searchdata;
    if (params.searchtype == 'type') {
        searchdata = 'type="'+searchdata ;
    }
    filewalker(search_path, function(err, data){
        if(err){
            throw err;
        }
        let files = [];
        for (let i=0, imax=data.length; i<imax; i++) {
            let item = data[i];
            let ext = getExtension(item);
            if (ext == 'js' || ext == 'axp' || ext == 'axs') {  // TODO : drop the test "js"
                let content = getFileContents(item);
                if (checkStringOccurs(content, searchdata)) {
                    files.push(item);
                }
            }
        }
        callback(res, params, files);
    });
}

function indexPage(res, params, files=[]) {
    var sel_options = [];
    sel_options.push({"code":"all", "desc": "All code"});
    sel_options.push({"code":"type", "desc": "Type attribute only"});

    var tmp_option = [];
    sel_options.forEach(function(sel_option) {
        var selected = '';
        if (sel_option.code == params.searchtype) {
            selected = 'selected';
        }
        tmp_option.push( `<option value="${sel_option.code}" ${selected}>${sel_option.desc}</option>` );
    });

    var tmp_li = [];
    files.forEach(function(item) {
        tmp_li.push(`<li>${item}</li>`);
    });

    var html = `<!DOCTYPE html>
    <html lang="en">
    <head>
    <title>Axoloti patch searching</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
        <div><h3>Axoloti patch searching</h3>
            <form>
                <p><label>Search criteria : <input name="searchdata" type="search" required
                    placeholder="component name"
                    value="${params.searchdata}"></label></p>
                <p><label>Searching on :
                    <select name="searchtype">
                       ${tmp_option.join('\n')}
                    </select>
                </label></p>
                <p><input type="submit" value="Submit"></p>
            </form>
        </div>
        <div id="result">
           <ul>
           ${tmp_li.join('\n')}
           </ul>
        </div>
    </body>
    </html>`;
    res.write(html)
    res.end();
}

function staticServer(req, res) {

    var filePath = '.' + req.url;
    if (filePath == './') {
        filePath = './index.html';
    }

    var extname = String(path.extname(filePath)).toLowerCase();
    var mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.svg': 'application/image/svg+xml'
    };

    var contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT') {
                fs.readFile('./404.html', function(error, content) {
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end(content, 'utf-8');
                });
            }
            else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                res.end();
            }
        }
        else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
}

function handler(req, res){
    var page = url.parse(req.url).pathname;

    if (page === '/') {
        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8'
        });
        // extraction des paramètres de req
        var params = url.parse(req.url, true).query;

        // construction de l’objet data contenant les filtres du formulaire
        var data = {};
        if ('searchdata' in params) {
            data.searchdata = String(params.searchdata).trim();
        } else {
            data.searchdata = '';
        }
        if ('searchtype' in params) {
            data.searchtype = String(params.searchtype).trim();
        } else {
            data.searchtype = 'type';
        }
        if (data.searchdata != '') {
            searchFiles(res, data, indexPage);
        } else {
            indexPage(res, data);
        }
    } else {
        staticServer(req, res);
    }
}

http.createServer(handler).listen(port, function(err){
    if(err){
        console.log('Error starting http server on port '+port);
    } else {
        console.log('Server listening on port '+port);
    }
});
