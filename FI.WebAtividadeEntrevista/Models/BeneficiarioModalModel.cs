using System.Collections.Generic;

namespace WebAtividadeEntrevista.Models
{
    public class BeneficiarioModalModel
    {
        public BeneficiarioModel Beneficiario { get; set; } = new BeneficiarioModel();
        public List<BeneficiarioModel> Beneficiarios { get; set; } = new List<BeneficiarioModel>();
    }
}