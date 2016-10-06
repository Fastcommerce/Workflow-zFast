var zF$=(function(){
	
	function fnLoginUserName(NameUser){
	  if("" != NameUser){
	    jQuery('.loginInfo').html("<span class='col-small-12'>Olá, <b>"+NameUser+"</b>,</span> <span class=''><a href='/cadastro.asp?IDLoja="+FC$.IDLoja+"&logoff=1' target='_top'><b>sair</b></a></span>");
	  }
	  else{jQuery('.loginInfo').html("<span class='col-small-12'>Olá, <span class=''>Faça <a href='/cadastro.asp?idloja="+FC$.IDLoja+"&pp=3&passo=1&sit=1'><b>Login</b></a></span> ou <span class=''><a href='/cadastro.asp?idloja="+FC$.IDLoja+"&pp=3&passo=1&sit=1'><b>cadastre-se</b></a></span>")}
	}

	function fnGetID(id){
    return document.getElementById(id);
  }

  function fnFormatNumber(num){
    num=num.toString().replace(/\$|\,/g,'');
    if(isNaN(num))num="0";
    var sign=(num==(num=Math.abs(num)));
    num=Math.floor(num*100+0.50000000001);
    num=Math.floor(num/100).toString();
    for(var i=0;i<Math.floor((num.length-(1+i))/3);i++)num=num.substring(0,num.length-(4*i+3))+'.'+num.substring(num.length-(4*i+3));
    return ((sign)?'':'-')+num;
  }

	var iPL=0;
 
  function fnShowPrice(Price,OriginalPrice,Cod,iMaxParcels,ProductID){
    iPL++;
    //console.log(ProductID+ " iPL="+ iPL +" Price="+Price +" OriginalPrice="+ OriginalPrice +" Cod="+ Cod);
    var idPrice=fnGetID("idProdPrice"+ProductID);
    var sPrice="";
    if(Price==0 && OriginalPrice==0){
      if(idPrice)idPrice.innerHTML="<div class=\"prices\"><div class=price><div class='currency zFConsultPrice' ><a href='/faleconosco.asp?idloja="+FC$.IDLoja+"&assunto=Consulta%20sobre%20produto%20(Código%20"+Cod+")' target='_top' >Preço Especial<br> Ligue e consulte!</a></div></div></div>";
      return void(0);
    }
    var iPrice=Price.toString().split(".");
    if(iPrice.length==2){
      var iPriceInt=iPrice[0];
      var PriceDecimal=iPrice[1];
      if(PriceDecimal.length==1)PriceDecimal+="0";
    }
    else{
      var iPriceInt=iPrice;
      var PriceDecimal="00";
    }    
    var sInterest;
    if(Price>=100)iMaxParcels=4;
    else if(Price>=75)iMaxParcels=3;
    else if(Price>=50)iMaxParcels=2;
    else if(Price>=1)iMaxParcels=1;
    if(typeof Juros!="undefined"){
      if(iMaxParcels==0||iMaxParcels>Juros.length)iMaxParcels=Juros.length;
      if(Juros[iMaxParcels-1]>0)sInterest=""; else sInterest=" s/juros";
    }
    else{
      iMaxParcels=0;
    }

    if(Price!=OriginalPrice){
      sPrice+="<div class=\"prices\">";
      sPrice+="  <div class=\"old-price\">de&nbsp;<span>"+FormatPrice(OriginalPrice,'R$')+"</span></div>";
      sPrice+="	 <div class=\"price\"><div class=\"por\">por&nbsp;</div><span class=\"currency\"><strong>R$ </span><span class=\"int\">"+ fnFormatNumber(iPriceInt) +"</span><span class=\"dec\">,"+ PriceDecimal +"</span></strong></div>";
      if(iMaxParcels>1)sPrice+="  <div class=\"installments\">ou&nbsp;<strong><span class=\"installment-count\">"+ iMaxParcels +"</span>x</strong> de <strong><span class=\"installment-price\">"+FormatPrecoReais(CalculaParcelaJurosCompostos(Price,iMaxParcels))+"</span></strong>"+ sInterest +"</div>";
      sPrice+="</div>";
    }
    else{
      sPrice+="<div class=\"prices\">";
      sPrice+="<div class=\"price\"><span class=\"currency\"><strong>R$ </span><span class=\"int\">"+ fnFormatNumber(iPriceInt) +"</span><span class=\"dec\">,"+ PriceDecimal +"</span></strong></div>";
      if(iMaxParcels>1)sPrice+="  <div class=\"installments\">ou&nbsp;<strong><span class=\"installment-count\">"+ iMaxParcels +"</span>x</strong> de <strong><span class=\"installment-price\">"+FormatPrecoReais(CalculaParcelaJurosCompostos(Price,iMaxParcels))+"</span></strong>"+ sInterest +"</div>";
      sPrice+="</div>";
    }
    if(idPrice)idPrice.innerHTML=sPrice;
  }

  function fnShowParcels(Price,iMaxParcels,ProductID){
    var idParcelsProd=fnGetID("idProdParcels"+ProductID);
    var sPrice="";
    var sInterest;
    if(typeof Juros!="undefined"){
      if(iMaxParcels==0||iMaxParcels>Juros.length)iMaxParcels=Juros.length;
      if(Juros[iMaxParcels-1]>0)sInterest=""; else sInterest=" sem juros";
    }
    else{
      iMaxParcels=0;
    }
    if(iMaxParcels>1 && Price>=1)sPrice+="<div class=\"installments-det\">Parcelamento em até <strong><span class=\"installment-det-count\">"+ iMaxParcels +"</span>x</strong> de <strong><span class=\"installment-det-price\">"+FormatPrecoReais(CalculaParcelaJurosCompostos(Price,iMaxParcels))+"</span></strong></div>";
    // if(iMaxParcels>1 && Price>=1)sPrice+="<div class=\"installments-det\">Parcelamento em até <strong><span class=\"installment-det-count\">"+ iMaxParcels +"</span>x</strong> de <strong><span class=\"installment-det-price\">"+FormatPrecoReais(CalculaParcelaJurosCompostos(Price,iMaxParcels))+"</span></strong>"+ sInterest +"</div>";
    if(idParcelsProd)idParcelsProd.innerHTML=sPrice;
  }

  function fnShowEconomy(ProdPrice,ProdPriceOri){
	  if(ProdPrice!=ProdPriceOri && typeof fnFormatNumber == 'function' && typeof FormatPrice == 'function' ){
	    return document.write("<font style='display:block;' color=#6f9e45>Economize <b>"+FormatPrice(ProdPriceOri-ProdPrice,'R$')+"</b> ("+fnFormatNumber(((ProdPriceOri-ProdPrice)/ProdPriceOri)*100)+"%)</font>");
	  }else{return "";}
	}

	function fnHome(){
		jQuery(document).ready(function($){
		  var owl = $("#owl-demo-prom"); //produtos especiais
      owl.owlCarousel({
        itemsCustom : [[0, 1], [320, 1], [600, 1], [768, 1], [1000, 2], [1300, 3]], navigation : true,pagination: false,navigationText:false
      });
      $(owl,".item").on("touchstart mousedown", function(e) {
          zF$.fnLazyLoadIMG('owl-demo');
      });
      $(owl, ".owl-next").on("click", function(e) {
          zF$.fnLazyLoadIMG('owl-demo-prom');
      })
      //0
      var owl0 = $("#owl-demo");
		  owl0.owlCarousel({
        // itemsCustom : [[0, 1], [320, 1], [600, 2], [768, 3], [1024, 4], [1200, 4], [1400, 5], [1600, 5]], navigation : true,pagination: false,navigationText:false
		    itemsCustom : [[0, 1], [320, 1], [600, 2], [768, 2], [1000, 3], [1345, 5]], navigation : true,pagination: false,navigationText:false
		  });
      $(owl0,".item").on("touchstart mousedown", function(e) {
          zF$.fnLazyLoadIMG('owl-demo');
      });
      $(owl0, ".owl-next").on("click", function(e) {
          zF$.fnLazyLoadIMG('owl-demo');
      });
      //1
		  var owl1 = $("#owl-demo1");
		  owl1.owlCarousel({
		    itemsCustom : [[0, 1], [320, 1], [600, 2], [768, 2], [1000, 3], [1345, 5]], navigation : true,pagination: false,navigationText:false
		  });
      $(owl1,".item").on("touchstart mousedown", function(e) {
          zF$.fnLazyLoadIMG('owl-demo1');
      });
      $(owl1, ".owl-next").on("click", function(e) {
          zF$.fnLazyLoadIMG('owl-demo1');
      });
      //2
		  var owl2 = $("#owl-demo2");
		  owl2.owlCarousel({
		    itemsCustom : [[0, 1], [320, 1], [600, 2], [768, 2], [1000, 3], [1345, 5]], navigation : true,pagination: false,navigationText:false
		  });
      $(owl2,".item").on("touchstart mousedown", function(e) {
          zF$.fnLazyLoadIMG('owl-demo2');
      });
      $(owl2, ".owl-next").on("click", function(e) {
          zF$.fnLazyLoadIMG('owl-demo2');
      });
      //3
      var owl3 = $("#owl-demo3");
      owl3.owlCarousel({
        itemsCustom : [[0, 1], [320, 1], [600, 2], [768, 2], [1000, 3], [1345, 5]], navigation : true,pagination: false,navigationText:false
      });
      $(owl3,".item").on("touchstart mousedown", function(e) {
          zF$.fnLazyLoadIMG('owl-demo3');
      });
      $(owl3, ".owl-next").on("click", function(e) {
          zF$.fnLazyLoadIMG('owl-demo3');
      });
      //4
      var owl4 = $("#owl-demo4");
      owl4.owlCarousel({
        itemsCustom : [[0, 1], [320, 1], [600, 2], [768, 2], [1000, 3], [1345, 5]], navigation : true,pagination: false,navigationText:false
      });
      $(owl4,".item").on("touchstart mousedown", function(e) {
          zF$.fnLazyLoadIMG('owl-demo4');
      });
      $(owl4, ".owl-next").on("click", function(e) {
          zF$.fnLazyLoadIMG('owl-demo4');
      });
      //5
      var owl5 = $("#owl-demo5");
      owl5.owlCarousel({
        itemsCustom : [[0, 1], [320, 1], [600, 2], [768, 2], [1000, 3], [1345, 5]], navigation : true,pagination: false,navigationText:false
      });
      $(owl5,".item").on("touchstart mousedown", function(e) {
          zF$.fnLazyLoadIMG('owl-demo5');
      });
      $(owl5, ".owl-next").on("click", function(e) {
          zF$.fnLazyLoadIMG('owl-demo5');
      });
      //6
      var owl6 = $("#owl-demo6");
      owl6.owlCarousel({
        itemsCustom : [[0, 1], [320, 1], [600, 2], [768, 2], [1000, 3], [1345, 5]], navigation : true,pagination: false,navigationText:false
      });
      $(owl6,".item").on("touchstart mousedown", function(e) {
          zF$.fnLazyLoadIMG('owl-demo6');
      });
      $(owl6, ".owl-next").on("click", function(e) {
          zF$.fnLazyLoadIMG('owl-demo6');
      });
      //7
      var owl7 = $("#owl-demo7");
      owl7.owlCarousel({
        itemsCustom : [[0, 1], [320, 1], [600, 2], [768, 2], [1000, 3], [1345, 5]], navigation : true,pagination: false,navigationText:false
      });
      $(owl7,".item").on("touchstart mousedown", function(e) {
          zF$.fnLazyLoadIMG('owl-demo7');
      });
      $(owl7, ".owl-next").on("click", function(e) {
          zF$.fnLazyLoadIMG('owl-demo7');
      });
      //8
      var owl8 = $("#owl-demo8");
      owl8.owlCarousel({
        itemsCustom : [[0, 1], [320, 1], [600, 2], [768, 2], [1000, 3], [1345, 5]], navigation : true,pagination: false,navigationText:false
      });
      $(owl8,".item").on("touchstart mousedown", function(e) {
          zF$.fnLazyLoadIMG('owl-demo8');
      });
      $(owl8, ".owl-next").on("click", function(e) {
          zF$.fnLazyLoadIMG('owl-demo8');
      });

		});

    zFPopUpIframe('.zFBoxRegisterHome','#fullBackground','#zFFloatNewsLetterCont, #fullBackground','#zFFloatNewsLetterCont, #fullBackground',27,'#zFFloatNewsLetterCont','.zFCloseNewsBtn','newsListProds');

	}
  
  function fnLazyLoadIMG(id){
    var oContentDOM = document.getElementById(id);
    if(oContentDOM){
      var allTagsImg = oContentDOM.getElementsByTagName("IMG");
      for(var i=0; i< allTagsImg.length; i++){
        var oImg = allTagsImg[i].getAttribute("data-src");
        if(oImg != null){
          allTagsImg[i].src= oImg;
        }
      }
    }
  }


//Ordenação
function ProdListaSelect(){
  /*var aList = ["Ordenar por", "Padrão", "Lançamentos", "Destaques", "Nomes das categorias", "Nomes dos produtos", "Avaliações dos clientes", "Promoções", "Preços menores", "Preços maiores"]; //padrao */
  var aList = [ ["Ordenar por", -1], ["Mais Vendidos", 2], ["Lançamentos", 1], ["Preços menores", 7], ["Preços maiores", 8] ];
  var sPag=document.location.href.toUpperCase();
  var iOrderParam = sPag.slice( (sPag.indexOf("ORDER")+6), (sPag.indexOf("ORDER")+7));
  var selected_option = !isNaN(parseInt(iOrderParam)) ? parseInt(iOrderParam) : -999;

  var selectTypeProd = "<select id=OrderProd class=smSelect onchange=zF$.NewOrderProLista(this.value)>"
    for(var i=0; i < aList.length; i++){
      var isSelected = (aList[i][1] == selected_option) ? "selected" : "";
      selectTypeProd += "<option value="+ aList[i][1] +" "+isSelected+">"+ aList[i][0] +"</option>";
    }
  selectTypeProd+="</select>";
  document.write(selectTypeProd);
}

function NewOrderProLista(iOrder){
  var sPag=document.location.href.toUpperCase();
  if(sPag.indexOf("/PROD,")==-1){var sConcat="&";var sCharSep="=";} else {sConcat=",";sCharSep=",";}

  var oOrder=document.getElementById('OrderProd');
  var posOrder=sPag.indexOf("ORDER"+sCharSep);
  if(posOrder!=-1){
     var iOrderCurrent=sPag.substr(posOrder+6,1);
    if(!isNaN(iOrderCurrent))if(iOrderCurrent>=0){
      var i=0;
      while(i<oOrder.length && oOrder.options[i].value!=iOrderCurrent)i++;
      if(i<oOrder.length)oOrder.selectedIndex=i;
    }
  }
  if(iOrder>=0){
    if(posOrder!=-1){document.location.href=document.location.href.replace(new RegExp('order'+sCharSep+iOrderCurrent),'order'+sCharSep+iOrder);}
    else{document.location.href=document.location.href.replace(new RegExp('idloja'+sCharSep+FC$.IDLoja,'gi'),'idloja'+sCharSep+FC$.IDLoja+sConcat+'order'+sCharSep+iOrder);}
  }
}

  function exibeRefinamentoBusca(){
    var deleteElement = function(sIdFiltro) {
      var el = document.querySelector(sIdFiltro);
      el.parentNode.removeChild(el);
    };

    var oFieldSearch = document.querySelector('#idPathSearchTextInputFC');
    var oFiltroBusca = document.getElementById('idUlPathSearchFC');
    var oFiltroCat = document.getElementById('idUlPathCatQtFC');
    var oFiltroAdic1 = document.getElementById('idUlAdic1QtFC');
    var oFiltroAdic2 = document.getElementById('idUlAdic2QtFC');
    var oFiltroAdic3 = document.getElementById('idUlAdic3QtFC');

    if(!oFiltroBusca)deleteElement('#idFiltroResultadoFC');
    if(!oFiltroCat)deleteElement('#idFiltroCatFC');
    if(!oFiltroAdic1)deleteElement('#idFiltroAdic1FC');
    if(!oFiltroAdic2)deleteElement('#idFiltroAdic2FC');
    if(!oFiltroAdic3)deleteElement('#idFiltroAdic3FC');

    if(!oFieldSearch){deleteElement('.zFBotRemoveFiltros')};

    var sTabFiltros = document.getElementById('idFiltrosBusca').innerHTML;
    if(oFiltroBusca || oFiltroCat || oFiltroAdic1 || oFiltroAdic2 || oFiltroAdic3){
      document.getElementById('idExibeFiltrosFC').style.display = 'block';
      document.getElementById('idExibeFiltrosFC').innerHTML = sTabFiltros;
    }
  }


  function fnUpdateCartZF(IsAdd,IsSpy,isToolbar){
    if (window.XMLHttpRequest){var oXMLHTTP=new XMLHttpRequest();}
    else{var oXMLHTTP=new ActiveXObject("Microsoft.XMLHTTP");}

    oXMLHTTP.onreadystatechange=function(){
     if (oXMLHTTP.readyState==4 && oXMLHTTP.status==200){ fnExecCart(oXMLHTTP.responseXML); }
    }
    oXMLHTTP.open("GET","/XMLCart.asp?IDLoja="+FC$.IDLoja+"",true);
    oXMLHTTP.send();

    var fnExecCart = function (oXMLDoc){
      var oItems=oXMLDoc.getElementsByTagName("item");
      var oCarts=oXMLDoc.getElementsByTagName("cart");
      try{var currencyProdCart=(oCarts[0].getElementsByTagName("currency")[0].childNodes[0].nodeValue);}catch(e){var currencyProdCart="R$"}
      try{var TotalQtyProdCart=(oCarts[0].getElementsByTagName("TotalQty")[0].childNodes[0].nodeValue);}catch(e){var TotalQtyProdCart="0"}
      try{var subtotalProdCart=(oCarts[0].getElementsByTagName("subtotal")[0].childNodes[0].nodeValue);}catch(e){var subtotalProdCart="0,00"}
      // if(parseInt(TotalQtyProdCart)>1){TotalQtyProdCart+=" itens"}else{TotalQtyProdCart+=" item"}
      var sHTMLCart = "<div class=\"zFArrowBottom\"></div>";
      for (var i=0;i<oItems.length;i++)
      {
        try{var ImgProdCart=(oItems[i].getElementsByTagName("image")[0].childNodes[0].nodeValue);}catch(e){var ImgProdCart=FC$.PathImg+"nd.gif"}
        var NomeProdCart=(oItems[i].getElementsByTagName("prod")[0].childNodes[0].nodeValue);
        var qtyProdCart=(oItems[i].getElementsByTagName("qty")[0].childNodes[0].nodeValue);
        var priceProdCart=(oItems[i].getElementsByTagName("price")[0].childNodes[0].nodeValue);
        var idProdCart=(oItems[i].getElementsByTagName("id")[0].childNodes[0].nodeValue);
        var sNomeProdFormart = (NomeProdCart.length > 22)? NomeProdCart.substring(0, 22) + "..." : NomeProdCart;
        sHTMLCart += "<div class=\"zFItemCartTop\"><span class=\"zFNameProdCartTop\">"+ sNomeProdFormart +" <b>("+ qtyProdCart +")</b>"+"</span><span class=\"zFPriceProdCartTop\">"+ currencyProdCart + " " + priceProdCart + "</span></div>"
      }
      sHTMLCart += "<a href=\"/AddProduto.asp?IDLoja="+ FC$.IDLoja +"\" class=\"zFBtnCartTop\">Finalizar compra</a>";

      if(IsSpy){
        var oReferrer=window.parent;
        try{oReferrer.document.getElementById("idCartItemsTop").innerHTML=TotalQtyProdCart;}catch(e){}
        try{oReferrer.document.getElementById("idCartTotalTop").innerHTML=FCLib$.FormatPreco(currencyProdCart +" "+ subtotalProdCart);}catch(e){}

        // if(isToolbar){
        //    try{oReferrer.document.getElementById("idCartItemsToolbar").innerHTML=TotalQtyProdCart;}catch(e){}
        //    try{oReferrer.document.getElementById("idCartTotalToolbar").innerHTML=FCLib$.FormatPreco(currencyProdCart +" "+ subtotalProdCart);}catch(e){}
        //    if(parseInt(TotalQtyProdCart)>0)document.getElementById("idCartToolbarDetailsZF").innerHTML = sHTMLCart;
        // }

      }else{
        try{document.getElementById("idCartItemsTop").innerHTML=TotalQtyProdCart;}catch(e){}
        try{document.getElementById("idCartTotalTop").innerHTML=FCLib$.FormatPreco(currencyProdCart +" "+ subtotalProdCart);}catch(e){}

        // if(isToolbar){
        //   try{document.getElementById("idCartItemsToolbar").innerHTML=TotalQtyProdCart;}catch(e){}
        //   try{document.getElementById("idCartTotalToolbar").innerHTML=FCLib$.FormatPreco(currencyProdCart +" "+ subtotalProdCart);}catch(e){}
        //   if(parseInt(TotalQtyProdCart)>0)document.getElementById("idCartToolbarDetailsZF").innerHTML = sHTMLCart;
        // }
      }
    }
  }

  function fnProdViewFlag(IDProd,PriceOri,PrecoNum){
    var oContainer = document.getElementById(IDProd);
    if(PriceOri !== PrecoNum){
      var oNewDiv = document.createElement("div");
      oNewDiv.setAttribute('class','zFBadgePromo');
      oContainer.appendChild(oNewDiv);
      oNewDiv.innerHTML="<img src='"+FC$.PathImg+"icpromobadge.png'>";
    }else{
      var imgDestaque = oContainer.querySelector("img.BotDestProdOut");
      if(imgDestaque){
        imgDestaque.style.display="block";
      }else{
        var imgDestaque = oContainer.querySelector("img.BotDestProd");
        if(imgDestaque)imgDestaque.style.display="block";
      }  
    };
  }

  function zFProdPromo(IDProd,PriceOri,PrecoNum){
    var oContainer = document.getElementById('zFProdContainer'+IDProd);
    if(PriceOri !== PrecoNum){
      var oNewDiv = document.createElement("div");
      oNewDiv.setAttribute('class','zFBadgePromo');
      oContainer.appendChild(oNewDiv);
      oNewDiv.innerHTML="<img src='"+FC$.PathImg+"icpromobadge.png'>";
    }
  }

  function fnProdNameFormater(IDProduto, limite, TabletLimite, codProd){
    var oNamePrd = document.getElementById(IDProduto);
    if(oNamePrd){
      var BWidth = jQuery('body').width();
      var sNameTxt = oNamePrd.textContent;

      //console.log(IDProduto, sNameTxt);
      if(sNameTxt.length > limite && BWidth>768){
        var sNameSlice = sNameTxt.slice(limite, sNameTxt.lastIndexOf(" Ref:"));
        //console.log('sNameSlice', sNameSlice);
        if(sNameSlice.length > 1) sNameTxt = sNameTxt.replace(sNameSlice, "...");
        oNamePrd.textContent = sNameTxt;
      }      
      else if(BWidth<=768){
        if(sNameTxt.length > TabletLimite){
          var sNameSlice = sNameTxt.slice(TabletLimite, sNameTxt.lastIndexOf(" Ref:"));
          if(sNameSlice.length > 1) sNameTxt = sNameTxt.replace(sNameSlice, "...");
          oNamePrd.textContent = sNameTxt;
        }   
      }

    }
  }

  function zFIndicaProd(idLoja,IDProduto){
    document.getElementById('zFProdIndica').innerHTML="<a href='javascript:MostraIndique("+idLoja+","+IDProduto+")'>Indique esse produto</a>";
  } 

  function fnFooter(IDLoja,sTxtTag){
    zFPopUpIframe('#zFClickBoxNews','#fullBackground','#zFFloatNewsLetterCont, #fullBackground','#zFFloatNewsLetterCont, #fullBackground',27,'#zFFloatNewsLetterCont','.zFCloseNewsBtn','newsListProds');

    jQuery('#FCCartRecalculateBut').html('<img src="'+FC$.PathImg+'recalcBtn.svg">');    
    jQuery('#FCCartStillShoppingBut').html('<img src="'+FC$.PathImg+'continuerBuyBtn.svg">');
    jQuery('#FCCartBuyBut,#FCCartRightBuyBut').html('<img src="'+FC$.PathImg+'BasketBtnBuy.svg">');

    // if (FC$.Page=="Products" && document.getElementById("idBRListaProdNotFoundFC")){
    //   var tableFCNotFound=document.getElementById("TabTitProd");
    //   tableFCNotFound.getElementsByTagName("div")[0].innerHTML="<div class='col-small-12 col-medium-12 col-large-4 col-xlarge-4 text-center-right-sm-md'><img src='"+FC$.PathImg+"404bad.png'></div><div class='col-small-12 col-medium-12 col-large-6 col-xlarge-6 text-left zFFontCalibre'><p class='zFNotFoundTxt'>Não encontramos produtos para esta busca.</p><span class='zFNotFoundSTxt'>"+sTxtTag+"</span><p class='zFNotFoundContinue'><a href='BuscaAvancada.asp?IDLoja="+IDLoja+"&produtos=20&order=1'>Clique aqui</a> e faça uma busca avançada ou</p><a href=/prod,idloja,"+IDLoja+",promocao,True class='zF404Promo'><img src='"+FC$.PathImg+"erro404Btn.svg'></a></div>";
    //   tableFCNotFound.getElementsByTagName("div")[0].innerHTML+="<iframe src='page,idloja,"+IDLoja+",arq,notFoundSearch.html,int,1,busca-nao-econtrada' width='100%' height='1000px' class='zFNotFoundFrame' frameborder='0' style='background-color:#FFF' allowtransparecy='true'>";
    // }
    fnIdentifyOSName();
    zFPlayerRadioLDP(); /* player radio ldp */
  }

  function fnIdentifyOSName(){

    // This script sets OSName variable as follows:
    // "Windows"    for all versions of Windows
    // "MacOS"      for all versions of Macintosh OS
    // "Linux"      for all versions of Linux
    // "UNIX"       for all other UNIX flavors 
    // "Unknown OS" indicates failure to detect the OS

    var sAppVersion = navigator.appVersion;
    var OSName="Unknown OS";
    if (sAppVersion.indexOf("Win")!=-1){
      OSName="Windows";
    }else if (sAppVersion.indexOf("Mac")!=-1){
      OSName="MacOS";
      var classMenu = document.querySelector('.zFListMainMenu');
      if(classMenu)classMenu.className = classMenu.className + " zFMacOS";

    }else if (sAppVersion.indexOf("X11")!=-1){
      OSName="UNIX";
    }else if (sAppVersion.indexOf("Linux")!=-1){
      OSName="Linux";
    }
    // console.log('sAppVersion=', sAppVersion);
  }

  function zFPlayerRadioLDP(){

    var d,i,b,popupRadio;

    var mobilecheck = function() {
      if( navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i) ){ return true; } else { return false;}
    }

    if(mobilecheck()) return false; /* não exibe botão no mobile */

    var $popupRadio = function(){


      var w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      width = w.innerWidth || e.clientWidth || g.clientWidth,
      Height = w.innerHeight|| e.clientHeight|| g.clientHeight,
      posDefault=200;

      var left = function(s){
        return Math.round(width/2) - Math.round(s/2) > posDefault ? Math.round(width/2) - Math.round(s/2) : posDefault;
      }

      var top = function(s){
        return Math.round(Height/2) - Math.round(s/2) > posDefault ? Math.round(Height/2) - Math.round(s/2) : posDefault;
      }

      return {
      left:left,
      top:top,
      }
    }

    d = document.createElement("div");
    d.id="idRadioFloatZF";
    d.className="zFRadioFloat";
    
    i = document.createElement("img");
    i.src= FC$.PathImg+"BtnRadioLPPlay.svg";  
    
//temp - até alterar script para pegar todo menu

// fim temp
    var ort = document.getElementById('zfOpenRadioTopo')

    if(ort){
      ort.onclick=function(e){
        e.preventDefault();
        var w=620, h=450; /* dimensoes janela popup */
        popupRadio = window.open("http://www.lojadoprazer.com.br/lojas/00000343/htm/RadioLP.html", "_blank", "width="+ w +", height="+ h +", left="+ $popupRadio().left(w) +", top="+ $popupRadio().top(h) +", status=yes,toolbar=no,menubar=no,location=no");
      }
    }
    
    i.onclick=function(){
      var w=620, h=450; /* dimensoes janela popup */
      popupRadio = window.open("http://www.lojadoprazer.com.br/lojas/00000343/htm/RadioLP.html", "_blank", "width="+ w +", height="+ h +", left="+ $popupRadio().left(w) +", top="+ $popupRadio().top(h) +", status=yes,toolbar=no,menubar=no,location=no");
    }

    d.appendChild(i);

    var es = document.createElement("span");
    es.setAttribute('class', 'zFRadioBtnContent zFRadioShow');
    es.setAttribute('data-rldp-btn', 'open');

    es.onclick = function(){
      var e = this, e_data = this.getAttribute('data-rldp-btn');
      var btn_box = document.getElementById("idRadioFloatZF");

      if(btn_box){
        if(e_data && e_data != ""){

          if(e_data === "open"){          
            jQuery(btn_box).removeClass('zFRadioShow');
            jQuery(btn_box).addClass('zFRadioHide');
            btn_box.getElementsByTagName('img')[0].src=FC$.PathImg+"BtnRadioLPPlayClose.svg";
            e.setAttribute('data-rldp-btn', 'close');
          }else if(e_data === "close"){
            jQuery(btn_box).removeClass('zFRadioHide');
            jQuery(btn_box).addClass('zFRadioShow');
            btn_box.getElementsByTagName('img')[0].src=FC$.PathImg+"BtnRadioLPPlay.svg";
            e.setAttribute('data-rldp-btn', 'open');
          }
        }
      }
    }

    d.appendChild(es);
    b = document.getElementsByTagName('body')[0];

    /* pop-up links Megamenu Ouça Agora */
    var allButtonRadioMenu = document.querySelectorAll('.zFOpenRadioManu');    
    if(allButtonRadioMenu && allButtonRadioMenu.length > 0){
      for(var j = 0; j < allButtonRadioMenu.length; j++){
        var oMenuRadio = allButtonRadioMenu[j];
        oMenuRadio.addEventListener("click", function(){
          var w=620, h=450; /* dimensoes janela popup */
          popupRadio = window.open("http://www.lojadoprazer.com.br/lojas/00000343/htm/RadioLP.html", "_blank", "width="+ w +", height="+ h +", left="+ $popupRadio().left(w) +", top="+ $popupRadio().top(h) +", status=yes,toolbar=no,menubar=no,location=no");
        });
      }
    }
    /* pop-up links Megamenu Ouça Agora */

    if(b){
      return b.appendChild(d);
    }
  }

  return{

    fnLoginUserName:fnLoginUserName,
    fnGetID:fnGetID,
    fnFormatNumber:fnFormatNumber,
    fnShowPrice:fnShowPrice,
    fnShowParcels:fnShowParcels,
    fnShowEconomy:fnShowEconomy,
    fnHome:fnHome,
    fnFooter:fnFooter,
    fnLazyLoadIMG:fnLazyLoadIMG,
    ProdListaSelect:ProdListaSelect,
    NewOrderProLista:NewOrderProLista,
    exibeRefinamentoBusca:exibeRefinamentoBusca,
    fnProdViewFlag:fnProdViewFlag,
    zFProdPromo:zFProdPromo,
    fnProdNameFormater:fnProdNameFormater,
    zFIndicaProd:zFIndicaProd,
    fnUpdateCartZF:fnUpdateCartZF,
    fnIdentifyOSName:fnIdentifyOSName,
    zFPlayerRadioLDP:zFPlayerRadioLDP
  }

})();


//Funções para o carrinho

var oDivShowCartOnPage=null;
var iLastCartOnPage=0;

function ShowCartOnPage(IDLoja,iErr,sMsg,sCartText,sCheckoutText,este){
  console.log('function ShowCartOnPage de LojaLib.js #####');
  var oPos=getPos(este);
  if(oDivShowCartOnPage==null){
    var oNewElement=document.createElement("div");
    oNewElement.setAttribute("id","DivShowCartOnPage"); 
    oDivShowCartOnPage=este.parentNode.insertBefore(oNewElement,este);
  }
  oDivShowCartOnPage.style.marginTop="-103px";
  oDivShowCartOnPage.style.marginLeft="5px";
  oDivShowCartOnPage.style.position="absolute";
  oDivShowCartOnPage.style.zIndex="1";
  var iW=266;
  var iH=100;
  var oPosPrice=document.getElementById('PosPrice');
  if(oPosPrice){
    iW=oPosPrice.offsetWidth;
    iH=oPosPrice.offsetHeight;
  }
  
  if(iErr==0){sBackColor="transparent";sFontColor="444444"} else {sBackColor="949494"}
    var sHTML="<table width=250 height=141 border=0 cellpadding=3 cellspacing=3 class='fc-botfin'>";
       sHTML+="<tr>";
       sHTML+="<td colspan=5 align=center style='background-color:#"+ sBackColor +";color:#000000;font-size:12;font-family:verdana;cursor:pointer;padding-left:39px;padding-top:31px; height: 36px'>"+ sMsg +"</td>";
       sHTML+="<td align=right><img src='"+FC$.PathImg+"cancel.png' hspace=5 style='cursor:pointer' onclick=oDivShowCartOnPage.style.visibility='hidden'></td>";
       sHTML+="</tr>";
       if(iErr==0){
         sHTML+="<tr>";
         sHTML+="<td width=3>&nbsp;</td>";
         sHTML+="<td align=center style=padding-bottom:18px;padding-left:20px><a onclick=oDivShowCartOnPage.style.visibility='hidden' style=color:#444444;text-decoration:none;font-size:14;cursor:pointer>CONTINUAR COMPRANDO</a></td>";
         sHTML+="<td width=3>&nbsp;</td>";
         sHTML+="<td align=center style=padding-bottom:18px;padding-left:20px><a href='addproduto.asp?idloja="+ IDLoja +"' style=color:#444444;text-decoration:none;font-size:14;color:#00b900>FINALIZAR PEDIDO</a></td>";
         sHTML+="</tr>";
       zF$.fnUpdateCartZF(true,false,true);
     }
     else{
         sHTML+="<tr height=20>";
         sHTML+="<td colspan=5 align=center><img src='images/cancel_off.png' hspace=5 style='cursor:pointer' onclick=oDivShowCartOnPage.style.visibility='hidden'></td>";
         sHTML+="</tr>";
     }
     sHTML+="</table>";
  oDivShowCartOnPage.style.top=0+"px";
  oDivShowCartOnPage.style.left=0+"px";
  oDivShowCartOnPage.innerHTML=sHTML;
  oDivShowCartOnPage.style.visibility="visible";
  iLastCartOnPage++;
  setTimeout("if(iLastCartOnPage=="+ iLastCartOnPage +")oDivShowCartOnPage.style.visibility='hidden';",54000);
}


function AdjustMainColumnsListDet(){
  var getBodyClass = document.body.getAttribute('class');
  if (getBodyClass==="FCProduct ProductList" || getBodyClass==="FCContact"){
    document.getElementById('idFCContent').setAttribute('class','col-small-12 col-medium-8 col-large-9 col-mlarge-10 col-xlarge-10');
  }
  else if(getBodyClass==="FCProduct ProductDet"){
    document.getElementById('idFCContent').setAttribute('class','col-small-12 col-medium-12 col-large-12 col-mlarge-12 col-xlarge-12');
  }
}

// Grade

/*Função para mostrar parcelamento*/
function fnMaxInstallmentsGrid(Price,iMaxParcels){
  var ComSem;  
  if(Price>=100)iMaxParcels=4;
  else if(Price>=75)iMaxParcels=3;
  else if(Price>=50)iMaxParcels=2;
  else if(Price>=1)iMaxParcels=1;
  if(typeof Juros!="undefined"){
    if(Price==0||iMaxParcels==1||Juros.length==0)return "";
    if(iMaxParcels==0||iMaxParcels>Juros.length)iMaxParcels=Juros.length;
    if(Juros[iMaxParcels-1]>0)sInterest=""; else sInterest="sem juros";
    return "<div class=FCInstallment><span class=FCInstallmentCount>"+iMaxParcels+"x</span> de <span class=FCInstallmentValue>"+FormatPrecoReais(CalculaParcelaJurosCompostos(Price,iMaxParcels))+"</span> "+sInterest+"</div>";
  }else{
    return "";
  }
}

/*Função para mostrar valor formatado*/
function FormatNumber(num){
  var num=num.toString().replace(/\$|\,/g,'');
  if(isNaN(num))num="0";
  sign=(num==(num=Math.abs(num))); num=Math.floor(num*100+0.50000000001); num=Math.floor(num/100).toString();
  for(var i=0;i<Math.floor((num.length-(1+i))/3);i++)num=num.substring(0,num.length-(4*i+3))+'.'+num.substring(num.length-(4*i+3));
  return ((sign)?'':'-')+num;
}

/*Função para mostrar valor economizado em produtos em promoção*/
function fnShowEconomyGrid(ProdPrice,ProdPriceOri){
  if(ProdPrice!=ProdPriceOri && typeof FormatNumber == 'function' && typeof FormatPrice == 'function' ){
    return "<span class='FCGridEconomy'>Economize <b>"+ FormatPrice(ProdPriceOri-ProdPrice,'R$') +"</b> ("+ FormatNumber(((ProdPriceOri-ProdPrice)/ProdPriceOri)*100)+"%)</span>";
  }else{return "";}
}


// ZipCode Grid FC - CEP - Begin 
function fnShowCEPGrid(IDProd){
  if(FC$.TypeFrt==3){
    var sNumCEP=fnGetCookie('CEP'+FC$.IDLoja);
    if(sNumCEP==null)sNumCEP="";
    sCEP="<div id='idDivCEPFC'>";
    sCEP+="  <div id='idDivTitCEP'><img src='"+ FC$.PathImg +"IconZipTruck.svg' width='25' height='25' alt='Zip box' /><span>Simule o valor do frete</span></div>";
    sCEP+="  <div id='idDivContentCEP'>";
    sCEP+="    <div id='idDivContentFieldsCEP'>";
    sCEP+="      <div id='idDivCEPCalc'>";
    sCEP+="        <div class='FieldCEP FieldCEPQty'><label>Qtd.</label><input type='number' id='idQtdZip"+ IDProd +"' value='1' maxlength='4'></div>";
    sCEP+="        <div class='FieldCEP FieldCEPNum'><input type='text' placeholder='CEP' id='idZip"+ IDProd +"' value='"+ sNumCEP +"' maxlength='9'></div>";
    sCEP+="        <img src='"+ FC$.PathImg +"IconNewsletter.svg' height='29px' id='idCEPButton' class='FieldCEPBtn' onclick='fnGetShippingValuesProdGrid("+ IDProd +")'>";
    sCEP+="      </div>";
    sCEP+="    </div>";
    sCEP+="    <div id='idDivImgLoadingCEPFC'><img src='"+ FC$.PathImg +"loadingcep.gif' vspace=3 style='display:none;' id=ImgLoadingCEP></div>";
    sCEP+="    <div id='idShippingValues"+ IDProd +"'></div></div>";
    sCEP+="  </div>";
    sCEP+="</div>";
    var oShowCEP=document.getElementById("ShowCEP"+IDProd);
    if(oShowCEP)oShowCEP.innerHTML=sCEP;
  }
}


function fnGetShippingValuesProdGrid(IDProd){
  sCEP=document.getElementById("idZip"+ IDProd).value;
  fnSetCookie('CEP'+FC$.IDLoja,sCEP);
  if(sCEP==""){document.getElementById("idShippingValues"+IDProd).innerHTML="<span class='freightResult' style=color:#990000;>Informe o CEP</span>";return;}
  document.getElementById("idShippingValues"+IDProd).innerHTML="";
  document.getElementById("ImgLoadingCEP").style.display='';
  var iQty=document.getElementById("idQtdZip"+IDProd).value;
  if(IDProd)var sParamProd="&idproduto="+ IDProd;
  else var sParamProd="";
  AjaxExecFC("/XMLShippingCEP.asp","IDLoja="+ FC$.IDLoja +"&qty="+ iQty +"&cep="+ sCEP + sParamProd,false,processXMLCEPGrid,IDProd);

}

function processXMLCEPGrid(obj,IDProd){
  var sShipping="";
  var oShippingValues=document.getElementById("idShippingValues"+IDProd);
  var iErr=ReadXMLNode(obj,"err");if(iErr==null)return;
  if(iErr!="0"){
    document.getElementById("ImgLoadingCEP").style.display='none';
    oShippingValues.innerHTML="<span class='freightResult' style=color:#990000;>"+ ReadXMLNode(obj,"msg") +"</span>";
    return;
  }
  oShippingValues.innerHTML="";
  var UseCart=ReadXMLNode(obj,"UseCart");
  if(UseCart=="False"){
    var ProdName=ReadXMLNode(obj,"ProdName");
    var ProdRef=ReadXMLNode(obj,"ProdRef");  
  }
  sShipping+="<div class='ZipOptions'>";
  var iOpt=ReadXMLNode(obj,"OptQt");
  for(var i=1;i<=iOpt;i++){
    var OptName=ReadXMLNode(obj,"Opt"+ i +"Name");
    var OptImage=ReadXMLNode(obj,"Opt"+ i +"Image");
    var OptObs=ReadXMLNode(obj,"Opt"+ i +"Obs");
    if(OptObs==null)OptObs="";
    sValorFrete=ReadXMLNode(obj,"Opt"+ i +"Value");
    if(sValorFrete=="R$ 0,00")sValorFrete="FRETE GRÁTIS";
    sShipping+="<div class='ZipOption'>";
    sShipping+="  <div class='ZipNameObs'>";
    sShipping+="    <div class='ZipName'>"+ OptName +"</div>";
    sShipping+="    <div class='ZipObsVal'>"+ OptObs +"</div>";
    sShipping+="  </div>";
    sShipping+="  <div class='ZipValue'>"+ sValorFrete +"</div>";
    sShipping+="</div>";
  }
  oShippingValues.innerHTML=sShipping;
  oShippingValues.style.display="block"; 
  sShipping+="</div>";
  document.getElementById("ImgLoadingCEP").style.display='none';
}

// ZipCode Grid FC - CEP - End 


function fnGetCookie(name){
  var arg=name+"=";
  var alen=arg.length;
  var clen=document.cookie.length;
  var i=0;
  while (i<clen){
    var j=i+alen;
    if(document.cookie.substring(i,j)==arg)return fnGetCookieVal(j);
    i=document.cookie.indexOf(" ",i)+1;
    if(i==0)break;
  }
  return null;
}

function fnGetCookieVal(offset){
  var endstr=document.cookie.indexOf(";",offset);
  if (endstr==-1)endstr=document.cookie.length;
  return unescape(document.cookie.substring(offset,endstr));
}

function fnSetCookie(name,value){
  var argv=fnSetCookie.arguments;
  var argc=fnSetCookie.arguments.length;
  var expires=(argc>2)?argv[2]:null;
  var path=(argc>3)?argv[3]:null;
  var domain=(argc>4)?argv[4]:null;
  var secure=(argc>5)?argv[5]:false;
  document.cookie=name+"="+escape(value)+((expires==null)?"":(";expires=" + expires.toGMTString()))+((path==null)?"":(";path="+path))+((domain==null)?"":(";domain="+domain))+((secure==true)?"; secure":"");
}

jQuery(window).scroll(function (event){
  var iWidthWindow = jQuery(window).width();
  var scroll = jQuery(window).scrollTop();
  if(scroll>30 && iWidthWindow >= 1000){
    jQuery('.zFFixedBarContainer').addClass('zFFixBar');
  }
  else{jQuery('.zFFixedBarContainer').removeClass('zFFixBar');}
  
  if(jQuery("#idFloatBoxBuyClosedZF").hasClass("zFBarClosed"))return false;
  
  if(scroll>=550 && iWidthWindow >= 1000){
    jQuery('.zFFloatBoxBuyProdDet').stop().animate({
      'right':'0'
    },200);

    jQuery("#idFloatBoxBuyClosedZF").attr('src', FC$.PathImg+'icBtnFloatRightClosed.svg');
  }else{
    jQuery('.zFFloatBoxBuyProdDet').stop().animate({
      'right':'-325px'
    },100);
    jQuery("#idFloatBoxBuyClosedZF").attr('src', FC$.PathImg+'icBtnFloatLeftClosed.svg');
  }

});

//Botão comprar flutuante prodDet
jQuery(document).ready(function (){
  jQuery(".zFProdDetLeftBuy .zFProdSeleciton").click(function (){
    jQuery('html, body').animate({
      scrollTop: jQuery(".zFBreadCrumbOrdCont").offset().top-90
    }, 1000);
  });

  jQuery("#idFloatBoxBuyClosedZF").click(function (){
    var iRight = jQuery(".zFFloatBoxBuyProdDet").css('right');
    if(parseInt(iRight)==0){
      jQuery(this).attr('src', FC$.PathImg+'icBtnFloatLeftClosed.svg');
      jQuery('.zFFloatBoxBuyProdDet').css('right', '-270px');          
      jQuery(this).addClass('zFBarClosed');
      jQuery(this).removeClass('zFBarOpen');
    }
    else{
      jQuery(this).attr('src', FC$.PathImg+'icBtnFloatRightClosed.svg');
      jQuery('.zFFloatBoxBuyProdDet').css('right', '0px');          
      jQuery(this).addClass('zFBarOpen');
      jQuery(this).removeClass('zFBarClosed');
    }
  });
});

// Mega menu
(function($){

  //define the defaults for the plugin and how to call it 
  $.fn.dcMegaMenu = function(options){
    //set default options  
    var defaults = {
      classParent: 'dc-mega',
      classContainer: 'sub-container',
      classSubParent: 'mega-hdr',
      classSubLink: 'mega-hdr',
      classWidget: 'dc-extra',
      rowItems: 3,
      speed: 'fast',
      effect: 'fade',
      event: 'hover',
      fullWidth: false,
      onLoad : function(){},
      beforeOpen : function(){},
      beforeClose: function(){}
    };

    //call in the default otions
    var options = $.extend(defaults, options);
    var $dcMegaMenuObj = this;

    //act upon the element that is passed into the design    
    return $dcMegaMenuObj.each(function(options){

      var clSubParent = defaults.classSubParent;
      var clSubLink = defaults.classSubLink;
      var clParent = defaults.classParent;
      var clContainer = defaults.classContainer;
      var clWidget = defaults.classWidget;
      
      megaSetup();
      
      function megaOver(){
        var subNav = $('.sub',this);
        $(this).addClass('mega-hover');
        if(defaults.effect == 'fade'){
          $(subNav).fadeIn(defaults.speed);
        }
        if(defaults.effect == 'slide'){
          $(subNav).show(defaults.speed);
        }
        // beforeOpen callback;
        defaults.beforeOpen.call(this);
      }
      function megaAction(obj){
        var subNav = $('.sub',obj);
        $(obj).addClass('mega-hover');
        if(defaults.effect == 'fade'){
          $(subNav).fadeIn(defaults.speed);
        }
        if(defaults.effect == 'slide'){
          $(subNav).show(defaults.speed);
        }
        // beforeOpen callback;
        defaults.beforeOpen.call(this);
      }
      function megaOut(){
        var subNav = $('.sub',this);
        $(this).removeClass('mega-hover');
        $(subNav).hide();
        // beforeClose callback;
        defaults.beforeClose.call(this);
      }
      function megaActionClose(obj){
        var subNav = $('.sub',obj);
        $(obj).removeClass('mega-hover');
        $(subNav).hide();
        // beforeClose callback;
        defaults.beforeClose.call(this);
      }
      function megaReset(){
        $('li',$dcMegaMenuObj).removeClass('mega-hover');
        $('.sub',$dcMegaMenuObj).hide();
      }

      function megaSetup(){
        $arrow = '<span class="dc-mega-icon"></span>';
        var clParentLi = clParent+'-li';
        var menuWidth = $dcMegaMenuObj.outerWidth();
        $('> li',$dcMegaMenuObj).each(function(){
          //Set Width of sub
          var $mainSub = $('> ul',this);
          var $primaryLink = $('> a',this);
          if($mainSub.length){
            $primaryLink.addClass(clParent).append($arrow);
            $mainSub.addClass('sub').wrap('<div class="'+clContainer+'" />');
            
            var pos = $(this).position();
            pl = pos.left;
              
            if($('ul',$mainSub).length){
              $(this).addClass(clParentLi);
              $('.'+clContainer,this).addClass('mega');
              $('> li',$mainSub).each(function(){
                if(!$(this).hasClass(clWidget)){
                  $(this).addClass('mega-unit');
                  if($('> ul',this).length){
                    $(this).addClass(clSubParent);
                    $('> a',this).addClass(clSubParent+'-a');
                  } else {
                    $(this).addClass(clSubLink);
                    $('> a',this).addClass(clSubLink+'-a');
                  }
                }
              });

              // Create Rows
              var hdrs = $('.mega-unit',this);
              rowSize = parseInt(defaults.rowItems);
              for(var i = 0; i < hdrs.length; i+=rowSize){
                hdrs.slice(i, i+rowSize).wrapAll('<div class="row" />');
              }

              // Get Sub Dimensions & Set Row Height
              $mainSub.show();
              
              // Get Position of Parent Item
              var pw = $(this).width();
              var pr = pl + pw;
              
              // Check available right margin
              var mr = menuWidth - pr;
              
              // // Calc Width of Sub Menu
              var subw = $mainSub.outerWidth();
              var totw = $mainSub.parent('.'+clContainer).outerWidth();
              var cpad = totw - subw;
              
              if(defaults.fullWidth == true){
                var fw = menuWidth - cpad;
                $mainSub.parent('.'+clContainer).css({width: fw+'px'});
                $dcMegaMenuObj.addClass('full-width');
              }
              var iw = $('.mega-unit',$mainSub).outerWidth(true);
              var rowItems = $('.row:eq(0) .mega-unit',$mainSub).length;
              var inneriw = iw * rowItems;
              var totiw = inneriw + cpad;
              
              // Set mega header height
              $('.row',this).each(function(){
                $('.mega-unit:last',this).addClass('last');
                var maxValue = undefined;
                $('.mega-unit > a',this).each(function(){
                  var val = parseInt($(this).height());
                  if (maxValue === undefined || maxValue < val){
                    maxValue = val;
                  }
                });
                $('.mega-unit > a',this).css('height',maxValue+'px');
                $(this).css('width',inneriw+'px');
              });
              
              // Calc Required Left Margin incl additional required for right align
              
              if(defaults.fullWidth == true){
                params = {left: 0};
              } else {
                
                var ml = mr < ml ? ml + ml - mr : (totiw - pw)/2;
                var subLeft = pl - ml;

                // If Left Position Is Negative Set To Left Margin
                var params = {left: pl+'px', marginLeft: -ml+'px'};
                
                if(subLeft < 0){
                  params = {left: 0};
                }else if(mr < ml){
                  params = {right: 0};
                }
              }
              $('.'+clContainer,this).css(params);
              
              // Calculate Row Height
              $('.row',$mainSub).each(function(){
                var rh = $(this).height();
                $('.mega-unit',this).css({height: rh+'px'});
                $(this).parent('.row').css({height: rh+'px'});
              });
              $mainSub.hide();
          
            } else {
              $('.'+clContainer,this).addClass('non-mega').css('left',pl+'px');
            }
          }
        });
        // Set position of mega dropdown to bottom of main menu
        var menuHeight = $('> li > a',$dcMegaMenuObj).outerHeight(true);
        $('.'+clContainer,$dcMegaMenuObj).css({top: menuHeight+'px'}).css('z-index','1000');
        
        if(defaults.event == 'hover'){
          // HoverIntent Configuration
          var config = {
            sensitivity: 2,
            interval: 100,
            over: megaOver,
            timeout: 400,
            out: megaOut
          };
          $('li',$dcMegaMenuObj).hoverIntent(config);
        }
        
        if(defaults.event == 'click'){
        
          $('body').mouseup(function(e){
            if(!$(e.target).parents('.mega-hover').length){
              megaReset();
            }
          });

          $('> li > a.'+clParent,$dcMegaMenuObj).click(function(e){
            var $parentLi = $(this).parent();
            if($parentLi.hasClass('mega-hover')){
              megaActionClose($parentLi);
            } else {
              megaAction($parentLi);
            }
            e.preventDefault();
          });
        }
        
        // onLoad callback;
        defaults.onLoad.call(this);
      }
    });
  };
})(jQuery);

(function($){$.fn.hoverIntent=function(f,g){var cfg={sensitivity:7,interval:100,timeout:0};cfg=$.extend(cfg,g?{over:f,out:g}:f);var cX,cY,pX,pY;var track=function(ev){cX=ev.pageX;cY=ev.pageY;};var compare=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);if((Math.abs(pX-cX)+Math.abs(pY-cY))<cfg.sensitivity){$(ob).unbind("mousemove",track);ob.hoverIntent_s=1;return cfg.over.apply(ob,[ev]);}else{pX=cX;pY=cY;ob.hoverIntent_t=setTimeout(function(){compare(ev,ob);},cfg.interval);}};var delay=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);ob.hoverIntent_s=0;return cfg.out.apply(ob,[ev]);};var handleHover=function(e){var p=(e.type=="mouseover"?e.fromElement:e.toElement)||e.relatedTarget;while(p&&p!=this){try{p=p.parentNode;}catch(e){p=this;}}if(p==this){return false;}var ev=jQuery.extend({},e);var ob=this;if(ob.hoverIntent_t){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);}if(e.type=="mouseover"){pX=ev.pageX;pY=ev.pageY;$(ob).bind("mousemove",track);if(ob.hoverIntent_s!=1){ob.hoverIntent_t=setTimeout(function(){compare(ev,ob);},cfg.interval);}}else{$(ob).unbind("mousemove",track);if(ob.hoverIntent_s==1){ob.hoverIntent_t=setTimeout(function(){delay(ev,ob);},cfg.timeout);}}};return this.mouseover(handleHover).mouseout(handleHover);};})(jQuery);

jQuery(document).ready(function($){
  $('#mega-menu').dcMegaMenu({
    rowItems: '5',
    speed: 'fast',
    effect: 'fade'
  });
  
  $(".os_tCategorias").addClass("apos_load");
  
  if(FC$.Page=="Home"){
            var options = {
                $FillMode: 2,                                       //[Optional] The way to fill image in slide, 0 stretch, 1 contain (keep aspect ratio and put all inside slide), 2 cover (keep aspect ratio and cover whole slide), 4 actual size, 5 contain for large image, actual size for small image, default value is 0
                $AutoPlay: true,                                    //[Optional] Whether to auto play, to enable slideshow, this option must be set to true, default value is false
                $AutoPlayInterval: 4000,                            //[Optional] Interval (in milliseconds) to go for next slide since the previous stopped if the slider is auto playing, default value is 3000
                $PauseOnHover: 1,                                  //[Optional] Whether to pause when mouse over if a slider is auto playing, 0 no pause, 1 pause for desktop, 2 pause for touch device, 3 pause for desktop and touch device, 4 freeze for desktop, 8 freeze for touch device, 12 freeze for desktop and touch device, default value is 1

                $ArrowKeyNavigation: true,                    //[Optional] Allows keyboard (arrow key) navigation or not, default value is false
                $SlideEasing: $JssorEasing$.$EaseOutQuint,          //[Optional] Specifies easing for right to left animation, default value is $JssorEasing$.$EaseOutQuad
                $SlideDuration: 800,                               //[Optional] Specifies default duration (swipe) for slide in milliseconds, default value is 500
                $MinDragOffsetToSlide: 20,                          //[Optional] Minimum drag offset to trigger slide , default value is 20
                //$SlideWidth: 600,                                 //[Optional] Width of every slide in pixels, default value is width of 'slides' container
                //$SlideHeight: 300,                                //[Optional] Height of every slide in pixels, default value is height of 'slides' container
                $SlideSpacing: 0,                           //[Optional] Space between each slide in pixels, default value is 0
                $DisplayPieces: 1,                                  //[Optional] Number of pieces to display (the slideshow would be disabled if the value is set to greater than 1), the default value is 1
                $ParkingPosition: 0,                                //[Optional] The offset position to park slide (this options applys only when slideshow disabled), default value is 0.
                $UISearchMode: 1,                                   //[Optional] The way (0 parellel, 1 recursive, default value is 1) to search UI components (slides container, loading screen, navigator container, arrow navigator container, thumbnail navigator container etc).
                $PlayOrientation: 1,                                //[Optional] Orientation to play slide (for auto play, navigation), 1 horizental, 2 vertical, 5 horizental reverse, 6 vertical reverse, default value is 1
                $DragOrientation: 1,                                //[Optional] Orientation to drag slide, 0 no drag, 1 horizental, 2 vertical, 3 either, default value is 1 (Note that the $DragOrientation should be the same as $PlayOrientation when $DisplayPieces is greater than 1, or parking position is not 0)
                $ArrowNavigatorOptions: {
                  $Class: $JssorArrowNavigator$
                },
                $BulletNavigatorOptions: {
                  $Class: $JssorBulletNavigator$
                }
            };

            
              var jssor_slider1 = new $JssorSlider$("slider1_container", options);

              //responsive code begin
              //you can remove responsive code if you don't want the slider scales while window resizes
              function ScaleSlider() {
                  var bodyWidth = document.body.clientWidth;
                  if (bodyWidth)
                      jssor_slider1.$ScaleWidth(Math.min(bodyWidth, 1366));
                  else
                      window.setTimeout(ScaleSlider, 30);
              }
              ScaleSlider();

              $(window).bind("load", ScaleSlider);
              $(window).bind("resize", ScaleSlider);
              $(window).bind("orientationchange", ScaleSlider);
              //responsive code end
            
  }

});

function zFPopUp(zFSClick1,zFSClick2,zFSIn,zFSOut,zFKeyPress,zFResizeSelctor,zFCloseBtn){
  jQuery(zFSClick1).click(function(){
    jQuery(zFSIn).fadeIn(400);
    // jQuery('body,html').css('overflow','hidden');
  });
  jQuery(zFSClick2).click(function(){
    jQuery(zFSOut).fadeOut(400);
    // jQuery('body,html').css('overflow','auto');
  });
  jQuery(zFCloseBtn).click(function(){
    jQuery(zFSOut).fadeOut(400);
    // jQuery('body,html').css('overflow','auto');

  });  
  jQuery(document).keyup(function(e) {
    if(e.keyCode == zFKeyPress){ // escape key maps to keycode `27`
      jQuery(zFSOut).fadeOut(400);
      // jQuery('body,html').css('overflow','auto');
    }
  });

  // Função que posiciona o elemento sempre no centro
  jQuery(window).resize(function(){
  jQuery(zFResizeSelctor).css({
    position:'fixed',
    left: (jQuery(window).width() - jQuery(zFResizeSelctor).outerWidth())/2,
    top: (jQuery(window).height() - jQuery(zFResizeSelctor).outerHeight())/2
  });
  });
  // Para iniciar a função:
  jQuery(window).resize();
}


function zFPopUpIframe(zFSClick1,zFSClick2,zFSIn,zFSOut,zFKeyPress,zFResizeSelctor,zFCloseBtn,iFrameId){
  jQuery(zFSClick1).click(function(){
    jQuery(zFSIn).fadeIn(400);
    var newsElement = document.getElementById(iFrameId);
    var newsElementAttr = newsElement.getAttribute('iframe-src');
    if(newsElementAttr){
      newsElement.src=newsElementAttr;
      newsElement.removeAttribute("iframe-src");          
    }
  });
  jQuery(zFSClick2).click(function(){
    jQuery(zFSOut).fadeOut(400);
    
  });
  jQuery(zFCloseBtn).click(function(){
    jQuery(zFSOut).fadeOut(400);
    

  });  
  jQuery(document).keyup(function(e) {
    if(e.keyCode == zFKeyPress){ // escape key maps to keycode `27`
      jQuery(zFSOut).fadeOut(400);
      
    }
  });

  // Função que posiciona o elemento sempre no centro
  jQuery(window).resize(function(){
  jQuery(zFResizeSelctor).css({
    position:'fixed',
    left: (jQuery(window).width() - jQuery(zFResizeSelctor).outerWidth())/2,
    top: (jQuery(window).height() - jQuery(zFResizeSelctor).outerHeight())/2
  });
  });
  // Para iniciar a função:
  jQuery(window).resize();
}

// Banner Cart
/*
function fnInsertBannerCart(){
  var n_d = document.createElement("div"), n_i = document.createElement("img"), n_a = document.createElement("a"), bpos = document.querySelector("#idTitTextoFC");
  n_d.className = "zFBannerCart";
  n_i.src= FC$.PathImg +"bannercartdiadosnamorados.png";
  n_i.alt="Banner Carrinho";
  n_a.href="prod,idLoja,"+ FC$.IDLoja +",avancada,true,promocao,true "
  n_a.title="Ir para as promoções do dia dos namorados";
  n_a.appendChild(n_i);
  n_d.appendChild(n_a);
  if(bpos){
    bpos.parentNode.insertBefore(n_d, bpos.nextSibling);
  }
}

jQuery(document).ready(function (){
  if(FC$.Page=="Cart")fnInsertBannerCart();
});*/