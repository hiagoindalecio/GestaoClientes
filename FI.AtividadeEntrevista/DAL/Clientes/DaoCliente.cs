using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using FI.AtividadeEntrevista.DML;

namespace FI.AtividadeEntrevista.DAL
{
    /// <summary>
    /// Classe de acesso a dados de Cliente
    /// </summary>
    internal class DaoCliente : AcessoDados
    {
        /// <summary>
        /// Inclui um novo cliente
        /// </summary>
        /// <param name="cliente">Objeto de cliente</param>
        internal long Incluir(Cliente cliente)
        {
            var dtBeneficiarios = new DataTable();
            dtBeneficiarios.Columns.Add("ID", typeof(long));
            dtBeneficiarios.Columns.Add("CPF", typeof(string));
            dtBeneficiarios.Columns.Add("NOME", typeof(string));

            foreach (var beneficiario in cliente.Beneficiarios)
                dtBeneficiarios.Rows.Add(beneficiario.Id, beneficiario.CPF, beneficiario.Nome);

            List<SqlParameter> parametros = new List<SqlParameter>
            {
                new SqlParameter("Nome", cliente.Nome),
                new SqlParameter("Sobrenome", cliente.Sobrenome),
                new SqlParameter("CPF", cliente.CPF),
                new SqlParameter("Nacionalidade", cliente.Nacionalidade),
                new SqlParameter("CEP", cliente.CEP),
                new SqlParameter("Estado", cliente.Estado),
                new SqlParameter("Cidade", cliente.Cidade),
                new SqlParameter("Logradouro", cliente.Logradouro),
                new SqlParameter("Email", cliente.Email),
                new SqlParameter("Telefone", cliente.Telefone),
                new SqlParameter("Beneficiarios", dtBeneficiarios)
            };

            DataSet ds = Consultar("FI_SP_IncCliente", parametros);
            long ret = 0;
            if (ds.Tables[0].Rows.Count > 0)
                long.TryParse(ds.Tables[0].Rows[0][0].ToString(), out ret);
            return ret;
        }

        /// <summary>
        /// Inclui um novo cliente
        /// </summary>
        /// <param name="cliente">Objeto de cliente</param>
        internal Cliente Consultar(long Id)
        {
            List<SqlParameter> parametros = new List<SqlParameter>
            {
                new SqlParameter("Id", Id)
            };

            DataSet ds = Consultar("FI_SP_ConsCliente", parametros);
            Cliente cli = Converter(ds);

            return cli;
        }

        internal bool VerificarExistencia(string cpf)
        {
            byte existe = 0;
            List<SqlParameter> parametros = new List<SqlParameter>
            {
                new SqlParameter("CPF", cpf)
            };

            DataSet ds = Consultar("FI_SP_VerificaCliente", parametros);

            if (ds.Tables[0].Rows.Count > 0)
                byte.TryParse(ds.Tables[0].Rows[0][0].ToString(), out existe);

            return existe > 0;
        }

        internal List<Cliente> Pesquisa(int iniciarEm, int quantidade, string campoOrdenacao, bool crescente, out int qtd)
        {
            List<SqlParameter> parametros = new List<SqlParameter>
            {
                new SqlParameter("iniciarEm", iniciarEm),
                new SqlParameter("quantidade", quantidade),
                new SqlParameter("campoOrdenacao", campoOrdenacao),
                new SqlParameter("crescente", crescente)
            };

            DataSet ds = Consultar("FI_SP_PesqCliente", parametros);
            List<Cliente> cli = ConverterPesquisa(ds);

            int iQtd = 0;

            if (ds.Tables.Count > 1 && ds.Tables[1].Rows.Count > 0)
                int.TryParse(ds.Tables[1].Rows[0][0].ToString(), out iQtd);

            qtd = iQtd;

            return cli;
        }

        /// <summary>
        /// Inclui um novo cliente
        /// </summary>
        /// <param name="cliente">Objeto de cliente</param>
        internal void Alterar(Cliente cliente)
        {
            List<SqlParameter> parametros = new List<SqlParameter>
            {
                new SqlParameter("CPF", cliente.CPF),
                new SqlParameter("Nome", cliente.Nome),
                new SqlParameter("Sobrenome", cliente.Sobrenome),
                new SqlParameter("Nacionalidade", cliente.Nacionalidade),
                new SqlParameter("CEP", cliente.CEP),
                new SqlParameter("Estado", cliente.Estado),
                new SqlParameter("Cidade", cliente.Cidade),
                new SqlParameter("Logradouro", cliente.Logradouro),
                new SqlParameter("Email", cliente.Email),
                new SqlParameter("Telefone", cliente.Telefone),
                new SqlParameter("ID", cliente.Id)
            };

            Executar("FI_SP_AltCliente", parametros);
        }


        /// <summary>
        /// Excluir Cliente
        /// </summary>
        /// <param name="cliente">Objeto de cliente</param>
        internal void Excluir(long Id)
        {
            List<SqlParameter> parametros = new List<SqlParameter>
            {
                new SqlParameter("Id", Id)
            };

            Executar("FI_SP_DelCliente", parametros);
        }

        private Cliente Converter(DataSet ds)
        {
            Cliente cliente = null;
            List<Beneficiario> beneficiarios = new List<Beneficiario>();

            if (ds != null && ds.Tables != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow row in ds.Tables[0].Rows)
                {
                    if (cliente == null)
                        cliente = new Cliente
                        {
                            Id = row.Field<long>("IdCliente"),
                            CEP = row.Field<string>("CEP"),
                            Cidade = row.Field<string>("Cidade"),
                            Email = row.Field<string>("Email"),
                            Estado = row.Field<string>("Estado"),
                            Logradouro = row.Field<string>("Logradouro"),
                            Nacionalidade = row.Field<string>("Nacionalidade"),
                            Nome = row.Field<string>("NomeCliente"),
                            Sobrenome = row.Field<string>("Sobrenome"),
                            Telefone = row.Field<string>("Telefone"),
                            CPF = row.Field<string>("CPFCliente")
                        };

                    if (!row.IsNull("IdBeneficiario")) // Se o cliente tem algum beneficiário cadastrado
                        beneficiarios.Add(new Beneficiario
                        {
                            Id = row.Field<long>("IdBeneficiario"),
                            Nome = row.Field<string>("NomeBeneficiario"),
                            CPF = row.Field<string>("CPFBeneficiario"),
                            IdCliente = cliente.Id
                        });
                }

                if (cliente != null)
                    cliente.Beneficiarios = beneficiarios;
            }

            return cliente;
        }

        private List<Cliente> ConverterPesquisa(DataSet ds)
        {
            List<Cliente> lista = new List<Cliente>();
            if (ds != null && ds.Tables != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow row in ds.Tables[0].Rows)
                {
                    Cliente cli = new Cliente
                    {
                        Id = row.Field<long>("Id"),
                        CEP = row.Field<string>("CEP"),
                        Cidade = row.Field<string>("Cidade"),
                        Email = row.Field<string>("Email"),
                        Estado = row.Field<string>("Estado"),
                        Logradouro = row.Field<string>("Logradouro"),
                        Nacionalidade = row.Field<string>("Nacionalidade"),
                        Nome = row.Field<string>("Nome"),
                        Sobrenome = row.Field<string>("Sobrenome"),
                        Telefone = row.Field<string>("Telefone"),
                        CPF = row.Field<string>("CPF")
                    };
                    lista.Add(cli);
                }
            }

            return lista;
        }
    }
}
