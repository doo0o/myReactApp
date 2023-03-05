$.namespace("prodUtil");
prodUtil = {
	FILE_EXT : "png",

	getTrimImgPath : function(carLine, salesSpecGrpCd, trim, extColor, seqNum){
		if(carLine==undefined || salesSpecGrpCd==undefined || trim==undefined || extColor==undefined) {
			return "";
		} else if(typeof seqNum != 'undefined'){
			return ("{0}/{1}/trim/{2}-{3}-0{4}." + this.FILE_EXT).format(carLine.toUpperCase(), salesSpecGrpCd, trim.toUpperCase(), extColor.toUpperCase(), seqNum);
		}else{
			return ("{0}/{1}/trim/{2}-{3}-0{4}." + this.FILE_EXT).format(carLine.toUpperCase(), salesSpecGrpCd, trim.toUpperCase(), extColor.toUpperCase(), "1");
		}
	},

	getConfExtImgPath : function(carLine, salesSpecGrpCd, trim, extColor, seqNum){
		return ("{0}/{1}/conf/ext/{2}-{3}-0{4}." + this.FILE_EXT).format(carLine.toUpperCase(), salesSpecGrpCd, trim.toUpperCase(), extColor.toUpperCase(), seqNum);
	},

	getConfExtOptImgPath : function(carLine, salesSpecGrpCd, optCd, extColor, seqNum){
		return ("{0}/{1}/conf/ext-opt/{2}-{3}-0{4}." + this.FILE_EXT).format(carLine.toUpperCase(), salesSpecGrpCd, optCd.toUpperCase(), extColor.toUpperCase(), seqNum);
	},

	getConfIntImgPath : function(carLine, salesSpecGrpCd, trim, intColor, seqNum){
		return ("{0}/{1}/conf/int/{2}-{3}-0{4}." + this.FILE_EXT).format(carLine.toUpperCase(), salesSpecGrpCd, trim.toUpperCase(), intColor.toUpperCase(), seqNum);
	},

	getConfIntOptImgPath : function(carLine, salesSpecGrpCd, optCd, intColor, seqNum){
		return ("{0}/{1}/conf/int-opt/{2}-{3}-0{4}." + this.FILE_EXT).format(carLine.toUpperCase(), salesSpecGrpCd, optCd.toUpperCase(), intColor.toUpperCase(), seqNum);
	},

	getConfTrimLvlImgPath : function(carLine, salesSpecGrpCd, lvlCd, size){
		if(typeof size != 'undefined'){
			return ("{0}/{1}/conf/trim-hierarchy/{2}-{3}." + this.FILE_EXT).format(carLine.toUpperCase(), salesSpecGrpCd, lvlCd.toUpperCase(), size);
		}else{
			return ("{0}/{1}/conf/trim-hierarchy/{2}-{3}." + this.FILE_EXT).format(carLine.toUpperCase(), salesSpecGrpCd, lvlCd.toUpperCase(), 'm');
		}
	},

	getConfExtColorImgPath : function(carLine, salesSpecGrpCd, colorCd, size){
		if(typeof size != 'undefined'){
			return ("{0}/{1}/conf/ext-color/{2}-{3}." + this.FILE_EXT).format(carLine.toUpperCase(), salesSpecGrpCd, colorCd.toUpperCase(), size);
		}else{
			return ("{0}/{1}/conf/ext-color/{2}-{3}." + this.FILE_EXT).format(carLine.toUpperCase(), salesSpecGrpCd, colorCd.toUpperCase(), 'm');
		}
	},

	getConfIntColorImgPath : function(carLine, salesSpecGrpCd, colorCd, size){
		if(typeof size != 'undefined'){
			return ("{0}/{1}/conf/int-color/{2}-{3}." + this.FILE_EXT).format(carLine.toUpperCase(), salesSpecGrpCd, colorCd.toUpperCase(), size);
		}else{
			return ("{0}/{1}/conf/int-color/{2}-{3}." + this.FILE_EXT).format(carLine.toUpperCase(), salesSpecGrpCd, colorCd.toUpperCase(), 'm');
		}
	},
	
	getConfPkgImgPath : function(carLine, salesSpecGrpCd, pkgCd){
		return ("{0}/{1}/conf/pkg/{2}." + this.FILE_EXT).format(carLine.toUpperCase(), salesSpecGrpCd, pkgCd.toUpperCase());
	},

	getConfOptImgPath : function(carLine, salesSpecGrpCd, optCd){
		return ("{0}/{1}/conf/opt/{2}." + this.FILE_EXT).format(carLine.toUpperCase(), salesSpecGrpCd, optCd.toUpperCase());
	},

};