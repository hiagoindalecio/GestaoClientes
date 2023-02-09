$(document).ready(function () {
    // Implementando máscaras dinâmicas
    $('#CPFBeneficiario').inputmask("mask", { "mask": "999.999.999-99" }, { reverse: true });
});