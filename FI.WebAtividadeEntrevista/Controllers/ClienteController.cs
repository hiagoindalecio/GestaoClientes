using FI.AtividadeEntrevista.BLL;
using WebAtividadeEntrevista.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using FI.AtividadeEntrevista.DML;

namespace WebAtividadeEntrevista.Controllers
{
    public class ClienteController : Controller
    {
        #region Views
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Incluir()
        {
            return View();
        }

        [HttpGet]
        public ActionResult Alterar(long id)
        {
            BoCliente bo = new BoCliente();
            Cliente cliente = bo.Consultar(id);
            ClienteModel model = null;

            if (cliente != null)
            {
                model = new ClienteModel()
                {
                    Id = cliente.Id,
                    CEP = cliente.CEP,
                    Cidade = cliente.Cidade,
                    Email = cliente.Email,
                    Estado = cliente.Estado,
                    Logradouro = cliente.Logradouro,
                    Nacionalidade = cliente.Nacionalidade,
                    Nome = cliente.Nome,
                    Sobrenome = cliente.Sobrenome,
                    Telefone = cliente.Telefone,
                    CPF = cliente.CPF
                };

                var beneficiarios = new List<BeneficiarioModel>();
                cliente.Beneficiarios.ForEach(b => beneficiarios.Add(new BeneficiarioModel
                {
                    Id = b.Id,
                    CPF = b.CPF,
                    Nome = b.Nome
                }));

                model.Beneficiarios = beneficiarios;
            }

            return View(model);
        }
        #endregion

        #region API Routes
        [HttpPost]
        public JsonResult Incluir(ClienteModel model)
        {
            BoCliente bo = new BoCliente();

            if (!ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {
                var beneficiarios = new List<Beneficiario>();
                model.Beneficiarios.ForEach(b => beneficiarios.Add(new Beneficiario
                {
                    Id = b.Id,
                    CPF = b.CPF,
                    Nome = b.Nome
                }));

                model.Id = bo.Incluir(new Cliente()
                {
                    CEP = model.CEP,
                    Cidade = model.Cidade,
                    Email = model.Email,
                    Estado = model.Estado,
                    Logradouro = model.Logradouro,
                    Nacionalidade = model.Nacionalidade,
                    Nome = model.Nome,
                    Sobrenome = model.Sobrenome,
                    Telefone = model.Telefone,
                    CPF = model.CPF,
                    Beneficiarios = beneficiarios
                });


                return Json("Cadastro efetuado com sucesso");
            }
        }

        [HttpPost]
        public JsonResult Alterar(ClienteModel model)
        {
            BoCliente bo = new BoCliente();
            BoBeneficiario boBen = new BoBeneficiario();

            if (!ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {
                bo.Alterar(new Cliente()
                {
                    Id = model.Id,
                    CEP = model.CEP,
                    Cidade = model.Cidade,
                    Email = model.Email,
                    Estado = model.Estado,
                    Logradouro = model.Logradouro,
                    Nacionalidade = model.Nacionalidade,
                    Nome = model.Nome,
                    Sobrenome = model.Sobrenome,
                    Telefone = model.Telefone,
                    CPF = model.CPF,
                });

                if (model.Beneficiarios.Any(b => b.Id == 0)) // Inclui novos beneficiários
                    model.Beneficiarios
                        .FindAll(b => b.Id == 0)
                        .ForEach(b => boBen.Incluir(new Beneficiario() {
                            Nome = b.Nome,
                            CPF= b.CPF,
                            IdCliente = model.Id
                        }));

                return Json("Cadastro alterado com sucesso");
            }
        }

        [HttpPost]
        public JsonResult ListarClientes(int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {
                string campo = string.Empty;
                string crescente = string.Empty;
                string[] array = jtSorting.Split(' ');

                if (array.Length > 0)
                    campo = array[0];

                if (array.Length > 1)
                    crescente = array[1];

                List<Cliente> clientes = new BoCliente().Pesquisa(jtStartIndex, jtPageSize, campo, crescente.Equals("ASC", StringComparison.InvariantCultureIgnoreCase), out int qtd);

                //Return result to jTable
                return Json(new { Result = "OK", Records = clientes, TotalRecordCount = qtd });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", ex.Message });
            }
        }

        [HttpGet]
        public JsonResult ValidarExistenciaCpf(string cpf)
        {
            try
            {
                var existe = new BoCliente().VerificarExistencia(cpf);

                return Json(new { Result = "OK", Valido = !existe }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        #endregion
    }
}