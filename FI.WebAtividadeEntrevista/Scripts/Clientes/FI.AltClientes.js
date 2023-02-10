$(document).ready(function () {
    function enviarRequisicao() {
        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $("#Nome").val(),
                "CPF": $("#CPF").val(),
                "CEP": $("#CEP").val(),
                "Email": $("#Email").val(),
                "Sobrenome": $("#Sobrenome").val(),
                "Nacionalidade": $("#Nacionalidade").val(),
                "Estado": $("#Estado").val(),
                "Cidade": $("#Cidade").val(),
                "Logradouro": $("#Logradouro").val(),
                "Telefone": $("#Telefone").val()
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
                    $("#formCadastro")[0].reset();
                    window.location.href = urlRetorno;
                }
        });
    }

    $('#formCadastro').submit(function (e) {
        e.preventDefault();
        const cpf = $('#formCadastro #CPF').val();
        if (!validaCpf(cpf))
            ModalDialog("Ocorreu um erro", "O CPF informado é inválido.");
        else if (cpfOriginal === $('#formCadastro #CPF').val())// Se o CPF não foi alterado
            enviarRequisicao();
        else // Demais casos verifica duplicidade de CPF no banco
            verificarExistenciaCpf().then(valido => {
                if (valido)
                    enviarRequisicao();
                else
                    ModalDialog("Ocorreu um erro", "O CPF informado já existe em nosso banco de dados.");
            });
    });
});
