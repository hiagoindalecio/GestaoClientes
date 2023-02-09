
$(document).ready(function () {
    // Implementando máscaras dinâmicas
    $('#formCadastro #CPF').inputmask("mask", { "mask": "999.999.999-99" }, { reverse: true });
    $('#formCadastro #CEP').inputmask("mask", { "mask": "99999-999" });
    $('#formCadastro #Telefone').inputmask("mask", { "mask": "(99) 99999-9999" });
});

function validaCpf() {
    let total = 0;
    let resto;

    cpf = $('#formCadastro #CPF').val()
        .replace(/[^0-9]/g, ''); // Remove caracteres não numéricos

    if (cpf == "00000000000")
        return false;

    for (i = 1; i <= 9; i++)
        total += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (total * 10) % 11;

    if (resto == 10 || resto == 11)
        resto = 0;

    if (resto != parseInt(cpf.substring(9, 10)))
        return false;

    total = 0;
    for (i = 1; i <= 10; i++)
        total += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (total * 10) % 11;

    if ((resto == 10) || (resto == 11))
        resto = 0;

    if (resto != parseInt(cpf.substring(10, 11)))
        return false;

    return true;
}

async function verificarExistenciaCpf() {
    let valido = false;
    await $.ajax({
        url: `${urlValidacaoCpf}?cpf=${$('#formCadastro #CPF').val()}`,
        method: "GET",
        error:
            function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
        success:
            function (r) {
                valido = r.Valido;
            }
    });

    return valido;
}

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}