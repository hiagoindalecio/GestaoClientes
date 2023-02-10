$(document).ready(function () {
    // Implementando máscaras dinâmicas
    $('#CPFBeneficiario').inputmask("mask", { "mask": "999.999.999-99" }, { reverse: true });

    formBeneficiarios = {
        listaBeneficiarios: [],
        functions: {
            salvar: (cpf, nome) => {
                if (!validaCpf(cpf))
                    ModalDialog("Ocorreu um erro", "O CPF informado é inválido.");
                else
                    formBeneficiarios.lista.functions.include(cpf, nome);
            },
            limpar: () => {
                $('#CPFBeneficiario').val('');
                $('#NomeBeneficiario').val('');
            }
        },
        lista: {
            functions: {
                include: (cpf, nome) => {
                    const cpfSomenteNum = cpf.replace(/[^0-9]/g, '');

                    if ($(`#${cpfSomenteNum}`).length)
                        ModalDialog("Ocorreu um erro", "O CPF informado já foi cadastrado.");
                    else {
                        $('#gridBeneficiarios').find('#gridBeneficiariosBody')
                            .append(`<tr id="${cpfSomenteNum}">
                                        <td>${cpf}</td>
                                        <td>${nome}</td>
                                        <td>
                                            <button type="button" class="btn btn-primary">Alterar</button> 
                                            <button type="button" class="btn btn-primary" onclick="formBeneficiarios.lista.functions.delete('${cpfSomenteNum}')">Excluir</button>
                                        </td>
                                    </tr>`);

                        formBeneficiarios.listaBeneficiarios.push({ cpf, nome });

                        formBeneficiarios.functions.limpar();
                    }
                },
                delete: (cpf) => {
                    $(`#${cpf}`).remove();
                    formBeneficiarios.listaBeneficiarios
                        .splice(formBeneficiarios.listaBeneficiarios.findIndex(ben => ben.cpf.replace(/[^0-9]/g, '') === cpf), 1);
                }
            }
        }
    }

    $('#btn-incluir-beneficiario').on('click', function (e) {
        e.preventDefault();

        const cpf = $('#CPFBeneficiario').val();
        const nome = $('#NomeBeneficiario').val();

        formBeneficiarios.functions.salvar(cpf, nome);
    });
});