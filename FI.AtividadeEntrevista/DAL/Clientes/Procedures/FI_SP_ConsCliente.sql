CREATE PROC FI_SP_ConsCliente
	@ID BIGINT
AS
BEGIN
	SELECT 
		cliente.ID AS IDCLIENTE,
		cliente.NOME AS NOMECLIENTE,
		cliente.SOBRENOME, 
		cliente.CPF AS CPFCLIENTE,
		cliente.NACIONALIDADE,
		cliente.CEP,
		cliente.ESTADO,
		cliente.CIDADE,
		cliente.LOGRADOURO,
		cliente.EMAIL, 
		cliente.TELEFONE,
		beneficiario.ID AS IDBENEFICIARIO,
		beneficiario.CPF AS CPFBENEFICIARIO,
		beneficiario.NOME AS NOMEBENEFICIARIO
	FROM CLIENTES cliente
	WITH(NOLOCK)
	LEFT JOIN BENEFICIARIOS beneficiario
		ON beneficiario.IDCLIENTE = cliente.ID
	WHERE cliente.ID = @ID
END