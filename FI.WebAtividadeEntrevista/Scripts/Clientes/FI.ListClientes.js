$(document).ready(function () {
    listaClientes = {
        funcoes: {
            excluirCliente(id) {
                $.ajax({
                    url: urlDelete,
                    method: "DELETE",
                    data: {
                        "ID": id
                    },
                    error:
                        function (r) {
                            if (r.status == 400)
                                ModalDialog("Ocorreu um erro", r.responseJSON);
                            else if (r.status == 500)
                                ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                        },
                    success:
                        function (r) {
                            ModalDialog("Sucesso!", r);
                            $('#gridClientes').jtable('load')
                        }
                });
            }
        },
        ferramentas: {
            ModalExclusao(id, nome) {
                var random = Math.random().toString().replace('.', '');
                var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
                    '        <div class="modal-dialog">                                                                                 ' +
                    '            <div class="modal-content">                                                                            ' +
                    '                <div class="modal-header">                                                                         ' +
                    '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
                    '                    <h4 class="modal-title">Atenção!</h4>                                                          ' +
                    '                </div>                                                                                             ' +
                    '                <div class="modal-body">                                                                           ' +
                    '                    <p>Deseja realmente excluir o(a) cliente ' + nome + '?</p>                                         ' +
                    '                </div>                                                                                             ' +
                    '                <div class="modal-footer">                                                                         ' +
                    '                    <button                                                                                        ' +
                    '                       type="button"                                                                               ' +
                    '                       class="btn btn-default"                                                                     ' +
                    '                       data-dismiss="modal">Cancelar</button>                                                      ' +
                    '                    <button                                                                                        ' +
                    '                       type="button"                                                                               ' +
                    '                       onclick="listaClientes.funcoes.excluirCliente(' + id + ')"                                  ' +
                    '                       class="btn btn-danger"                                                                      ' +
                    '                       data-dismiss="modal">Confirmar</button>                                                     ' +
                    '                </div>                                                                                             ' +
                    '            </div><!-- /.modal-content -->                                                                         ' +
                    '  </div><!-- /.modal-dialog -->                                                                                    ' +
                    '</div> <!-- /.modal -->                                                                                            ';

                $('body').append(texto);
                $('#' + random).modal('show');
            }
        }
    }

    if (document.getElementById("gridClientes"))
        $('#gridClientes').jtable({
            title: 'Clientes',
            paging: true,
            pageSize: 5,
            sorting: true,
            defaultSorting: 'Nome ASC',
            actions: {
                listAction: urlClienteList,
            },
            fields: {
                Nome: {
                    title: 'Nome',
                    width: '40%'
                },
                Email: {
                    title: 'Email',
                    width: '25%'
                },
                Alterar: {
                    title: '',
                    display: function (data) {
                        return `<div style="justify-content: space-around;display: flex;">
                                    <button
                                        onclick="window.location.href=\'${urlAlteracao}/${data.record.Id}\'"
                                        class="btn btn-primary btn-sm">Alterar</button>
                                    <button
                                        onclick="listaClientes.ferramentas.ModalExclusao(${data.record.Id}, '${data.record.Nome}')"
                                        class="btn btn-danger btn-sm">Excluir</button>
                                </div>`
                    }
                }
            }
        });

    if (document.getElementById("gridClientes"))
        $('#gridClientes').jtable('load');
})