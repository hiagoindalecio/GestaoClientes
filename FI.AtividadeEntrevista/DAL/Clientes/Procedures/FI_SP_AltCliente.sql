CREATE PROC FI_SP_AltCliente
    @NOME          VARCHAR (50) ,
    @SOBRENOME     VARCHAR (255),
	@CPF           VARCHAR (14) ,
    @NACIONALIDADE VARCHAR (50) ,
    @CEP           VARCHAR (9)  ,
    @ESTADO        VARCHAR (2)  ,
    @CIDADE        VARCHAR (50) ,
    @LOGRADOURO    VARCHAR (500),
    @EMAIL         VARCHAR (2079),
    @TELEFONE      VARCHAR (15) ,
	@ID            BIGINT       ,
	@BENEFICIARIOS BeneficiariosList NULL READONLY
AS
BEGIN TRAN
	UPDATE CLIENTES 
	SET 
		NOME = @NOME, 
		SOBRENOME = @SOBRENOME,
		CPF = @CPF,
		NACIONALIDADE = @NACIONALIDADE, 
		CEP = @CEP, 
		ESTADO = @ESTADO, 
		CIDADE = @CIDADE, 
		LOGRADOURO = @LOGRADOURO, 
		EMAIL = @EMAIL, 
		TELEFONE = @TELEFONE
	WHERE ID = @ID

    -- Busca beneficiários já cadastrados para este cliente
    DECLARE @BeneficiariosExistentes BeneficiariosList
    INSERT INTO @BeneficiariosExistentes (ID, CPF, NOME)
    SELECT ID, CPF, NOME
    FROM BENEFICIARIOS
    WHERE IDCLIENTE = @ID

    -- Variáveis auxiliares
    DECLARE @IdBen BIGINT = 0;
    DECLARE @CpfBen VARCHAR (14) = ''
    DECLARE @NomeBen VARCHAR (50) = ''

	-- Cria e atualiza beneficiarios
    DECLARE cursor_ben_recebidos CURSOR FOR
        SELECT ID, CPF, NOME
        FROM @BENEFICIARIOS

    OPEN cursor_ben_recebidos  
    FETCH NEXT FROM cursor_ben_recebidos INTO @IdBen, @CpfBen, @NomeBen

    WHILE @@FETCH_STATUS = 0  
    BEGIN
        IF (@IdBen = 0)
            EXEC dbo.FI_SP_IncBeneficiario @NOME = @NomeBen, @CPF = @CpfBen, @IDCLIENTE = @ID;
        ELSE
            EXEC dbo.FI_SP_AltBeneficiario @NOME = @NomeBen, @CPF = @CpfBen, @ID = @IdBen;

        FETCH NEXT FROM cursor_ben_recebidos INTO @IdBen, @CpfBen, @NomeBen
    END

    -- Deleta beneficiarios
    DECLARE cursor_ben_existentes CURSOR FOR
        SELECT ID
        FROM @BeneficiariosExistentes
        WHERE ID NOT IN (SELECT ID FROM @BENEFICIARIOS)

    OPEN cursor_ben_existentes  
    FETCH NEXT FROM cursor_ben_existentes INTO @IdBen

    WHILE @@FETCH_STATUS = 0  
    BEGIN
        EXEC dbo.FI_SP_DelBeneficiario @ID = @IdBen;

        FETCH NEXT FROM cursor_ben_existentes INTO @IdBen
    END
COMMIT