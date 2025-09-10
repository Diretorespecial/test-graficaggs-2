// Autor: José Minelli
isdebug = false;

isminimized = false;

// Função pra verificar se é mobile
function isMobile() {
  return /Mobi|Android/i.test(navigator.userAgent);
}

$(document).ready(function () {

  // Alterar tipo de receituário
  $(".radio").change(function () {
    if ($(this).val() == "tipo_amarelo") {
      $("#qtd").val("1").attr("disabled", true);
      $("#valor").val("R$ 90,00");
    } else {
      $("#qtd").attr("disabled", false);
    }
  });

  // Atualizar valor baseado na quantidade
  $("#qtd").change(function () {
    let valor = 0;
    switch ($(this).val()) {
      case "1": valor = 100; break;
      case "2": valor = 120; break;
      case "3": valor = 130; break;
      case "4": valor = 140; break;
      case "5": valor = 150; break;
      case "6": valor = 170; break;
      case "10": valor = 210; break;
      case "20": valor = 260; break;
    }
    $("#valor").val("R$ " + valor + ",00");
  });

  // Botão copiar PITX
  $("#pitxbtn").click(function () {
    navigator.clipboard.writeText(13641389000104).then(function () {
      alert("Pitx copiado para a área de transferência!");
    });
  });

  // Botão minimizar avisos
  $("#minimizar").click(function () {
    if (isminimized) {
      $("#avisos").removeClass("minimized");
      $("#minimizar").removeClass("rotated").addClass("rotated2");
    } else {
      $("#avisos").addClass("minimized");
      $("#minimizar").removeClass("rotated2").addClass("rotated");
    }
    isminimized = !isminimized;
  });

  // Gerar documentos
  $("#generateDoc").click(function () {
    if (!checkimputs()) return;

    setTimeout(function () {
      $("html, body").animate({ scrollTop: $("#preview").offset().top }, 800);
    }, 500);

    $(".results").fadeIn(300).removeClass("hidden");
    $(".result").removeClass("hidden");

    let docType = $("input[name='receituario']:checked").val();
    let docPath = `assets/${docType}.png`;

    // Coleta dados do formulário
    let nome, crm, especialidade, endereco, telefone, bairro, cidade, cep,
        rg, numero, data, valor, complemento, nomesocial, cpf, rua;

    rua = $("#rua").val();
    nome = $("#nameform").val();
    crm = $("#crm").val();
    especialidade = $("#especialidade").val();
    endereco = $("#endereco").val();
    telefone = $("#telefone").val();
    bairro = $("#bairro").val();
    complemento = $("#complemento").val();
    cidade = $("#cidade").val();
    cep = $("#cep").val();
    rg = $("#rg").val();
    numero = $("#numero").val();
    cpf = $("#cpf").val();
    nomesocial = $("#nome_social").val();
    data = $("#data").val();

    if (isdebug) { // Dados de teste
      nome = nomesocial = "José Minelli";
      crm = "123456";
      especialidade = "Cardiologia";
      endereco = "Rua Exemplo, 123";
      telefone = "(11) 98765-4321";
      bairro = "Centro";
      complemento = "Apto 101";
      cidade = "São Paulo";
      cep = "12345-678";
      rg = "12.345.678-9";
      numero = "123";
      cpf = "123.456.789-00";
      data = "2023-10-01";
    }

    let dataFormatada = new Date(data);
    let dia = dataFormatada.getDate().toString().padStart(2, "0");
    let mes = dataFormatada.toLocaleString("default", { month: "long" });
    let ano = dataFormatada.getFullYear();

    // Função genérica para gerar PDF a partir de Canvas
    function gerarPDF(imgSrc, largura, altura, downloadBtnId, fileName, drawCallback) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      let img = new Image();
      img.src = imgSrc;

      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        drawCallback(ctx);
        const { jsPDF } = window.jspdf;
        let doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [largura, altura] });
        let imgData = canvas.toDataURL("image/png");
        doc.addImage(imgData, "PNG", 0, 0, largura, altura);
        $(`#${downloadBtnId}`).attr("href", doc.output("bloburl")).attr("download", fileName).show();
        $(`#preview${downloadBtnId.slice(-1)}`).attr("src", imgData);
      };
    }

    // Receituário
    gerarPDF(docPath, 960, 355, "downloadBtn", "receituario.pdf", function (ctx) {
      ctx.font = docType == "tipo_amarelo" ? "50px TimesNewRoman" : "60px TimesNewRoman";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      endereco = endereco + " " + numero + " - " + bairro;
      telefone = telefone + " - " + cidade + " - MG";
      if (docType == "tipo_amarelo") {
        ctx.fillText(nome, 1400, 160);
        ctx.font = "bold 30px Arial";
        ctx.fillText(especialidade, 1400, 200);
        ctx.fillText(crm, 1400, 230);
        ctx.font = "bold 25px Arial";
        ctx.fillText(endereco, 1400, 255);
        ctx.fillText(telefone, 1400, 275);
      } else {
        ctx.fillText(nome, 1750, 160);
        ctx.font = "bold 35px Arial";
        ctx.fillText(especialidade, 1750, 200);
        ctx.fillText(crm, 1750, 240);
        ctx.font = "bold 30px Arial";
        ctx.fillText(endereco, 1750, 320);
        ctx.fillText(telefone, 1750, 350);
      }
    });

    // Procuração
    let procuracaoPath = docType == "tipo_amarelo" ? "assets/procuracao_a.png" : "assets/procuracao.png";
    gerarPDF(procuracaoPath, 210, 297, "downloadBtn2", "procuracao.pdf", function (ctx2) {
      ctx2.font = "bold 40px Arial";
      ctx2.fillStyle = "black";
      if (docType == "tipo_amarelo") {
        ctx2.fillText(nome, 650, 820);
        ctx2.font = "bold 35px Arial";
        ctx2.fillText(rg, 1000, 900);
        ctx2.fillText(cpf, 100, 980);
        ctx2.fillText(endereco, 100, 1090);
        ctx2.fillText(cidade, 1700, 1090);
        ctx2.fillText("MG", 300, 1190);
        ctx2.fillText(dia, 1680, 1840);
        ctx2.fillText(mes, 1870, 1840);
        ctx2.fillText(cidade, 1200, 1840);
        ctx2.fillText(ano, 2200, 1843);
      } else {
        ctx2.fillText(nome, 550, 450);
        ctx2.font = "bold 35px Arial";
        ctx2.fillText(rg, 680, 505);
        ctx2.fillText(cpf, 100, 565);
        ctx2.font = "bold 30px Arial";
        ctx2.fillText(endereco, 100, 615);
        ctx2.fillText(bairro, 100, 680);
        ctx2.fillText(cidade, 800, 680);
        ctx2.fillText(dia, 1025, 1100);
        ctx2.fillText(mes, 1200, 1100);
        ctx2.fillText("MG", 1450, 680);
        ctx2.fillText(telefone, 1750, 300);
      }
    });

    // Requisição
    gerarPDF("assets/requisicao.png", 210, 297, "downloadBtn3", "requisicao.pdf", function (ctx3) {
      ctx3.font = "bold 30px Arial";
      ctx3.fillStyle = "black";
      ctx3.fillText(nome, 200, 360);
      ctx3.fillText(nomesocial, 200, 420);
      ctx3.fillText(crm, 200, 490);
      ctx3.fillText(especialidade, 500, 490);
      ctx3.fillText(telefone, 1100, 490);
      ctx3.fillText(rua, 200, 560);
      ctx3.fillText(numero, 1100, 560);
      ctx3.fillText(complemento, 1300, 560);
      ctx3.fillText(cidade, 200, 630);
      ctx3.fillText(bairro, 760, 630);
      ctx3.fillText(cep, 1300, 630);
      let dataFormatada3 = new Date(data);
      ctx3.fillText(`${dataFormatada3.getDate()}/${(dataFormatada3.getMonth()+1).toString().padStart(2,'0')}/${dataFormatada3.getFullYear()}`, 200, 2140);
      ctx3.font = "bold 25px Arial";
      ctx3.fillText(crm, 1350, 2140);
    });

    // Declaração
    gerarPDF("assets/declaracao.png", 210, 297, "downloadBtn4", "declaracao.pdf", function (ctx4) {
      ctx4.font = "28px Arial";
      ctx4.fillStyle = "black";
      ctx4.fillText(nome, 208, 358);
      ctx4.fillText(cpf, 280, 428);
      ctx4.fillText(rg, 1012, 421);
      ctx4.fillText(especialidade, 200, 564);
      let enderecoCompleto = `${endereco}, ${numero} - ${complemento} - ${bairro} - ${cidade} - ${cep}`;
      ctx4.font = "22px Arial";
      ctx4.fillText(enderecoCompleto, 152, 636);
      ctx4.fillText("Belo Horizonte", 446, 1710);
      ctx4.fillText(dia, 606, 775);
      ctx4.fillText(mes, 772, 775);
      ctx4.fillText(ano, 962, 775);
      ctx4.fillText(dia, 949, 1716);
      ctx4.fillText(mes, 1097, 1716);
      ctx4.fillText(ano, 1250, 1716);
    });

  });
});

// Verifica campos obrigatórios
function checkimputs() {
  if (isdebug) return true;

  let allFieldsFilled = true;

  $("#pfFields").find("input[required], select[required]").each(function () {
    if ($(this).val().trim() === "") {
      allFieldsFilled = false;
      $(this).addClass("error");
    } else {
      $(this).removeClass("error");
    }
  });

  if (!$("input[name='receituario']:checked").val()) {
    alert("Por favor, selecione um tipo de receituário.");
    return false;
  }

  return allFieldsFilled;
}
