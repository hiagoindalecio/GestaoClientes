$(document).ready(function () {
    // Implementando máscaras dinâmicas
    $('#CPFBeneficiario').inputmask("mask", { "mask": "999.999.999-99" }, { reverse: true });

    formBeneficiarios = {
        listaBeneficiarios: beneficiariosExistentes,
        refCpfEmEdicao: '',
        funcoes: {
            salvar: (id, cpf, nome) => {
                if (!validaCpf(cpf))
                    ModalDialog("Ocorreu um erro", "O CPF informado é inválido.");
                else if (id === '')
                    formBeneficiarios.lista.funcoes.include(cpf, nome);
                else
                    formBeneficiarios.lista.funcoes.update(id, cpf, nome);
            },
            limpar: () => {
                $('#IdBeneficiario').val('');
                $('#CPFBeneficiario').val('');
                $('#NomeBeneficiario').val('');
                formBeneficiarios.refCpfEmEdicao = '';
            }
        },
        lista: {
            funcoes: {
                encontrarIndicePorCpf: (cpf) =>
                    formBeneficiarios.listaBeneficiarios.findIndex(ben => ben.CPF === cpf || ben.CPF.replace(/[^0-9]/g, '') === cpf),
                include: (cpf, nome) => {
                    if (formBeneficiarios.lista.funcoes.encontrarIndicePorCpf(cpf) !== -1)
                        ModalDialog("Ocorreu um erro", "O CPF informado já foi cadastrado.");
                    else {
                        $('#gridBeneficiarios').find('#gridBeneficiariosBody')
                            .append(formBeneficiarios.lista.funcoes.montarLinha(cpf, nome));

                        formBeneficiarios.listaBeneficiarios.push({ Id: 0, CPF: cpf, Nome: nome });

                        formBeneficiarios.funcoes.limpar();
                    }
                },
                delete: (cpf) => {
                    $(`#${cpf}`).remove();
                    formBeneficiarios.listaBeneficiarios
                        .splice(formBeneficiarios.lista.funcoes.encontrarIndicePorCpf(cpf), 1);
                },
                update: (id, cpf, nome, cpfAnterior) => {
                    const indicePorCpf = formBeneficiarios.lista.funcoes.encontrarIndicePorCpf(cpf);

                    if (indicePorCpf !== -1 &&
                        formBeneficiarios.listaBeneficiarios[indicePorCpf].Id.toString() !== id) // Encontrou CPF igual em um beneficiário diferente do que está sendo editado
                        ModalDialog("Ocorreu um erro", "O CPF informado já foi cadastrado.");
                    else {
                        // Atualiza item na lista do modal
                        const itemLista = $(`#${formBeneficiarios.refCpfEmEdicao}`);
                        $(itemLista).find(`td[name='cpf']`).html(cpf);
                        $(itemLista).find(`td[name='nome']`).html(nome);
                        $(itemLista).find(`button[name='alterar-beneficiario']`)
                            .attr('onclick', `formBeneficiarios.lista.funcoes.modoEdicao('${cpf.replace(/[^0-9]/g, '')}')`);
                        $(itemLista).attr('id', cpf.replace(/[^0-9]/g, ''));

                        // Atualiza lista de beneficiários salvos no formulário
                        const indicePorCpfExistente = formBeneficiarios.lista.funcoes.encontrarIndicePorCpf(formBeneficiarios.refCpfEmEdicao);
                        formBeneficiarios.listaBeneficiarios[indicePorCpfExistente].CPF = cpf;
                        formBeneficiarios.listaBeneficiarios[indicePorCpfExistente].Nome = nome;

                        formBeneficiarios.funcoes.limpar();
                        formBeneficiarios.lista.funcoes.modoAdicao();
                    }
                },
                montarLinha: (cpf, nome) => {
                    const cpfSomenteNum = cpf.replace(/[^0-9]/g, '');

                    return `<tr id="${cpfSomenteNum}">
                                <td name="cpf">${cpf}</td>
                                <td name="nome">${nome}</td>
                                <td>
                                    <span class="d-inline-block" tabindex="0" data-bs-toggle="tooltip">
                                        <button type="button"
                                            name="alterar-beneficiario"
                                            class="btn btn-primary"
                                            onclick="formBeneficiarios.lista.funcoes.modoEdicao('${cpfSomenteNum}')">
                                            Alterar
                                        </button>
                                    </span>
                                    <span class="d-inline-block" tabindex="0" data-bs-toggle="tooltip">
                                        <button type="button"
                                            class="btn btn-danger"
                                            onclick="formBeneficiarios.lista.funcoes.delete('${cpfSomenteNum}')">
                                            Excluir
                                        </button>
                                    </span>
                                </td>
                            </tr>`
                },
                modoEdicao: (cpf) => {
                    const index = formBeneficiarios.lista.funcoes.encontrarIndicePorCpf(cpf);
                    if (index > -1) {
                        $('#IdBeneficiario').val(formBeneficiarios.listaBeneficiarios[index].Id);
                        $('#CPFBeneficiario').val(formBeneficiarios.listaBeneficiarios[index].CPF);
                        $('#NomeBeneficiario').val(formBeneficiarios.listaBeneficiarios[index].Nome);
                        formBeneficiarios.refCpfEmEdicao = formBeneficiarios.listaBeneficiarios[index].CPF.replace(/[^0-9]/g, '');
                        formBeneficiarios.lista.funcoes.bloquear();
                        $('#btn-incluir-beneficiario').html('Atualizar');
                    }
                },
                modoAdicao: () => {
                    formBeneficiarios.lista.funcoes.desbloquear();
                    $('#btn-incluir-beneficiario').html('Incluir');
                },
                bloquear: () => {
                    $('#gridBeneficiarios').find('#gridBeneficiariosBody button')
                        .attr('disabled', true)
                        .parent()
                        .attr('title', 'Por favor, finalize a edição');
                },
                desbloquear: () => {
                    $('#gridBeneficiarios').find('#gridBeneficiariosBody button')
                        .attr('disabled', false)
                        .parent()
                        .removeAttr('title');
                }
            }
        }
    }

    if (formBeneficiarios.listaBeneficiarios.length > 0)
        formBeneficiarios.listaBeneficiarios.forEach(b =>
            $('#gridBeneficiarios').find('#gridBeneficiariosBody')
                .append(formBeneficiarios.lista.funcoes.montarLinha(b.CPF, b.Nome)));

    $('#btn-incluir-beneficiario').on('click', function (e) {
        e.preventDefault();

        const id = $('#IdBeneficiario').val();
        const cpf = $('#CPFBeneficiario').val();
        const nome = $('#NomeBeneficiario').val();

        formBeneficiarios.funcoes.salvar(id, cpf, nome);
    });
});