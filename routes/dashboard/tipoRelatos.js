var express = require('express');
const Utils = require("../../utils");
const http = require("http");
var router = express.Router();
const util = new Utils();
router.patch('/:id/edit', function (req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/');
    } else {
        let data = {
            id: req.params.id,
            descricao: req.body.descricao,
            key: process.env.KEY_VALIDATION,
        }
        let encrypted = util.encrypt(JSON.stringify(data));
        const options = {
            "method": "POST",
            "hostname": process.env.API_HOST,
            "port": process.env.API_PORT,
            "path": "/classificacao/editar"
        };
        const req2 = http.request(options, function (res2) {
            const chunks = [];

            res2.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res2.on("end", function () {
                try {
                    const body = Buffer.concat(chunks);
                    const decrypted = util.decrypt(body.toString());
                    const data = JSON.parse(decrypted);
                    if (data.error) {
                        res.status(500).json({error: data.error});
                    } else {
                        if (data.key === process.env.KEY_VALIDATION) {
                            res.status(200).send("<script>htmx.trigger(document.getElementById('contentList'),'refeshTable');</script>");
                        } else {
                            res.status(403).json({error: 'Invalid key'});
                        }
                    }
                } catch (e) {
                    res.status(500).json({error: e});
                }
            });
        });
        req2.write(JSON.stringify({data: encrypted}));
        req2.end();
    }
});
router.get('/:id/edit', function (req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/');
    } else {
        let data = {
            id: req.params.id,
            key: process.env.KEY_VALIDATION,
        }
        let encrypted = util.encrypt(JSON.stringify(data));
        const options = {
            "method": "POST",
            "hostname": process.env.API_HOST,
            "port": process.env.API_PORT,
            "path": "/classificacao/obter"
        };
        const req2 = http.request(options, function (res2) {
            const chunks = [];

            res2.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res2.on("end", function () {
                try {
                    const body = Buffer.concat(chunks);
                    const decrypted = util.decrypt(body.toString());
                    const data = JSON.parse(decrypted);
                    if (data.error) {
                        res.status(500).json({error: data.error});
                    } else {
                        if (data.key === process.env.KEY_VALIDATION) {
                            let html = "";
                            html += '<tr hx-target="closest tr" hx-swap="outerHTML" class="">\n' +
                                '        <td class="text-center border-end">' + data.item.id + '</td>\n' +
                                '        <td>\n' +
                                '    <form id="formAltTipRel" hx-patch="/dashboard/tipoRelatos/' + data.item.id + '/edit">\n' +
                                '            <input type="text" class="form-control" value="' + data.item.nome + '" name="descricao" id="descricao">\n' +
                                '    </form>\n' +
                                '        </td>\n' +
                                '        <td class="text-center border-start">\n' +
                                '            <button type="button" onclick="htmx.trigger(document.getElementById(\'formAltTipRel\'), \'submit\');" class="btn btn-outline-success btn-cadastrar btn-sm me-2">Salvar</button>\n' +
                                '            <button type="button" class="btn btn-outline btn-sm ms-2" onclick="htmx.trigger(document.getElementById(\'contentList\'),\'refeshTable\');">Cancelar</button>\n' +
                                '        </td>\n' +
                                '</tr>';
                            res.status(200).send(html);
                        } else {
                            res.status(403).json({error: 'Invalid key'});
                        }
                    }
                } catch (e) {
                    res.status(500).json({error: e});
                }
            });
        });
        req2.write(JSON.stringify({data: encrypted}));
        req2.end();
    }

})
router.delete('/:id', function (req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/');
    } else {
        let data = {
            id: req.params.id,
            key: process.env.KEY_VALIDATION,
        }
        let encrypted = util.encrypt(JSON.stringify(data));
        const options = {
            "method": "POST",
            "hostname": process.env.API_HOST,
            "port": process.env.API_PORT,
            "path": "/classificacao/deletar"
        };
        const req2 = http.request(options, function (res2) {
            const chunks = [];

            res2.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res2.on("end", function () {
                try {
                    const body = Buffer.concat(chunks);
                    const decrypted = util.decrypt(body.toString());
                    const data = JSON.parse(decrypted);
                    if (data.error) {
                        res.status(500).json({error: data.error});
                    } else {
                        if (data.key === process.env.KEY_VALIDATION) {
                            res.status(200).send("<script>htmx.trigger(document.getElementById('contentList'),'refeshTable');</script>");
                        } else {
                            res.status(403).json({error: 'Invalid key'});
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            });
        });
        req2.write(JSON.stringify({data: encrypted}));
        req2.end();
    }
});
router.post('/', function (req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/');
    } else {
        let data = {
            tipo: req.body.tipoRelato,
            descricao: req.body.descricao,
            key: process.env.KEY_VALIDATION,
        }

        let encrypted = util.encrypt(JSON.stringify(data));
        const options = {
            "method": "POST",
            "hostname": process.env.API_HOST,
            "port": process.env.API_PORT,
            "path": "/classificacao/cadastrar"
        };

        const req2 = http.request(options, function (res2) {
            const chunks = [];

            res2.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res2.on("end", function () {
                try {
                    const body = Buffer.concat(chunks);
                    const decrypted = util.decrypt(body.toString());
                    const data = JSON.parse(decrypted);
                    if (data.error) {
                        res.status(500).json({error: data.error});
                    } else {
                        if (data.key === process.env.KEY_VALIDATION) {
                            res.status(200).send("<script>htmx.trigger(document.getElementById('contentList'),'refeshTable');</script>");
                        } else {
                            res.status(403).json({error: 'Invalid key'});
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            });
        });
        req2.write(JSON.stringify({data: encrypted}));
        req2.end();
    }
});
router.get('/', (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect('/');
    }
    res.render('dashboard/gen_tipo_relatos');
});
router.get('/lista', (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect('/');
    }


    const options = {
        "method": "GET",
        "hostname": process.env.API_HOST,
        "port": process.env.API_PORT,
        "path": "/classificacao/lista?tipo=" + req.query.tipo
    };

    const req2 = http.request(options, function (res2) {
        const chunks = [];

        res2.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res2.on("end", function () {
            const body = Buffer.concat(chunks);
            const decrypted = util.decrypt(body.toString());
            const data = JSON.parse(decrypted);
            if (data.error) {
                res.json({error: data.error});
            } else {
                if (data.key === process.env.KEY_VALIDATION) {

                    if (data.lista.length > 0) {
                        let html = '';

                        data.lista.forEach((item) => {
                            html += '<tr hx-target="closest tr" hx-swap="outerHTML">' +
                                '                        <td class="text-center border-end">' + item.id + '</td>' +
                                '                        <td>' + item.nome + '</td>' +
                                '                        <td class="text-center border-start"><button class="btn btn-outline-warning btn-sm me-2" hx-get="/dashboard/tipoRelatos/' + item.id + '/edit">Editar</button>' +
                                '                            <button class="btn btn-outline-danger btn-sm ms-2 btn-delete"' +
                                '                                    hx-confirm="Deseja realmente remover o tipo de relato?"  hx-delete="/dashboard/tipoRelatos/' + item.id + '">' +
                                '                                Remover' +
                                '                             <div class="spinner-border spinner-border-sm text-light btn-delete-spinner htmx-indicator" role="status" style="display:none;">' +
                                '        <span class="visually-hidden">Carregando...</span>' +
                                '    </div></button></td>' +
                                '                    </tr>';
                        });
                        res.send(html);
                    } else {
                        res.send('<tr  hx-target="closest tr" hx-swap="outerHTML">' +
                            '                        <td colspan="3">' +
                            '                            <div class="p-3">' +
                            '                            <div class="row col-12 text-center"><p>Nao foram encontrado registros</p></div>' +
                            '                                <div class="row col-12 d-flex justify-content-center"><button hx-get="/dashboard/tipoRelatos/lista?tipo=' + req.query.tipo + '" type="button" id="#btnRefresh" class="btn btn-outline-warning col-2">Atuaizar lista</button></div>' +
                            '                            </div>' +
                            '                        </td>' +
                            '                    </tr>');
                    }
                } else {
                    res.send('<tr  hx-target="closest tr" hx-swap="outerHTML">' +
                        '                        <td colspan="3">' +
                        '                            <div class="d-flex justify-content-center">' +
                        '                                <div class="row col-12 d-flex justify-content-center"><button hx-get="/dashboard/tipoRelatos/lista?tipo=' + req.query.tipo + '" type="button" id="#btnRefresh" class="btn btn-outline-warning col-2">Atuaizar lista</button></div>' +
                        '                            </div>' +
                        '                        </td>' +
                        '                    </tr>');
                }
            }
        });
    });
    req2.end();
});

module.exports = router;