$(document).ready(function () {
    // Implementando máscaras dinâmicas
    $('#CPFBeneficiario').inputmask("mask", { "mask": "999.999.999-99" }, { reverse: true });

    formBeneficiarios = {
        listaBeneficiarios: beneficiariosExistentes,
        functions: {
            salvar: (CPF, Nome) => {
                if (!validaCpf(CPF))
                    ModalDialog("Ocorreu um erro", "O CPF informado é inválido.");
                else
                    formBeneficiarios.lista.functions.include(CPF, Nome);
            },
            limpar: () => {
                $('#CPFBeneficiario').val('');
                $('#NomeBeneficiario').val('');
            }
        },
        lista: {
            functions: {
                include: (CPF, Nome) => {
                    const cpfSomenteNum = CPF.replace(/[^0-9]/g, '');

                    if ($(`#${cpfSomenteNum}`).length)
                        ModalDialog("Ocorreu um erro", "O CPF informado já foi cadastrado.");
                    else {
                        $('#gridBeneficiarios').find('#gridBeneficiariosBody')
                            .append(`<tr id="${cpfSomenteNum}">
                                        <td>${CPF}</td>
                                        <td>${Nome}</td>
                                        <td>
                                            <button type="button" class="btn btn-primary">Alterar</button> 
                                            <button type="button" class="btn btn-primary" onclick="formBeneficiarios.lista.functions.delete('${cpfSomenteNum}')">Excluir</button>
                                        </td>
                                    </tr>`);

                        formBeneficiarios.listaBeneficiarios.push({ id: 0, CPF, Nome });

                        formBeneficiarios.functions.limpar();
                    }
                },
                delete: (CPF) => {
                    $(`#${CPF}`).remove();
                    formBeneficiarios.listaBeneficiarios
                        .splice(formBeneficiarios.listaBeneficiarios.findIndex(ben => ben.CPF.replace(/[^0-9]/g, '') === CPF), 1);
                }
            }
        }
    }

    if (formBeneficiarios.listaBeneficiarios.length > 0)
        formBeneficiarios.listaBeneficiarios.forEach(b =>
            $('#gridBeneficiarios').find('#gridBeneficiariosBody')
                .append(`<tr id="${b.CPF.replace(/[^0-9]/g, '')}">
                            <td>${b.CPF}</td>
                            <td>${b.Nome}</td>
                            <td>
                                <button type="button" class="btn btn-primary">Alterar</button> 
                                <button type="button" class="btn btn-primary" onclick="formBeneficiarios.lista.functions.delete('${b.CPF.replace(/[^0-9]/g, '')}')">Excluir</button>
                            </td>
                        </tr>`));

    $('#btn-incluir-beneficiario').on('click', function (e) {
        e.preventDefault();

        const CPF = $('#CPFBeneficiario').val();
        const Nome = $('#NomeBeneficiario').val();

        formBeneficiarios.functions.salvar(CPF, Nome);
    });
});