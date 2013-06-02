<!--

	Lars Berg Hustveit
	lars.berg@hustveit.org

	XSLT 2.0, XSLT 2.0 Prosessor: Saxon-HE 9.3
	
	Oppretta: 11.12.2011
	Sist oppdatert: 08.01.2012
-->
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">


<!--
Her bestemmer ein korleis output skal bli.
Ved å bruke omit-xml-declaration="yes" unngår ein følgjande: <?xml version="1.0" encoding="UTF-8"?>
-->
<xsl:output indent="yes" omit-xml-declaration="yes"/><!-- This is for the main output file. -->
<xsl:output name="text" method="text" indent="yes"/>
<!-- <xsl:output name="xml" method="xml"/>Her får line nr 1 følgjande deklarasjon: <?xml version="1.0" encoding="UTF-8"?> -->
<xsl:output name="xml" method="xml" indent="yes" omit-xml-declaration="yes"/>


<!--
Plassering av output-filer.
Kvar domenemodellen skal plasserast kan stillast inn i Eclipse.
-->
<xsl:param name="dir_route_things">file:///C:/eclipse-output/sprek/route_things</xsl:param>
<xsl:param name="dir_route_documents">file:///C:/eclipse-output/sprek/route_documents</xsl:param>
<xsl:param name="dir_place_things">file:///C:/eclipse-output/sprek/place_things</xsl:param>
<xsl:param name="dir_place_documents">file:///C:/eclipse-output/sprek/place_documents</xsl:param>
<xsl:param name="dir_semantic">file:///C:/eclipse-output/sprek</xsl:param>




<!-- Start within: <pma_xml_export> -->
<xsl:template match="pma_xml_export/database" >


<!-- ///////////////////////////////////////////////////////////////////////////////////////////////////



	DOMAIN MODEL - START

########################################################################################################
//////////////////////////////////////////////////////////////////////////////////////////////////// -->


<xsl:message terminate="no">/domain_model.ttl</xsl:message>
<xsl:text disable-output-escaping="yes">
@prefix dct: &lt;http://purl.org/dc/terms/&gt; .
@prefix sf_ont: &lt;http://data.sognefjord.vestforsk.no/resource/ontology#&gt; .

</xsl:text>


	<!--
	For-each: <table name="routes">
	-->
	<xsl:for-each select="table[@name='routes']">
	
		<!-- Lagar $thing_id -->
		<xsl:variable name="thing_id" select="concat(column[@name='id'],'')"/>
		<!-- Lagar $filename -->
		<xsl:variable name="filename" select="concat(column[@name='id'],'.ttl')"/>
	
		<!-- Testing testing... 
		<xsl:value-of select="column[@name='id']"/>
		<xsl:value-of select="column[@name='name']"/>
		-->

<!--
../<table name="routes_spots">
No skal me hente alle "spots" som tilhøyrer denne ruta
-->
<xsl:for-each-group select="../table[@name='routes_spots']" group-by="column[@name='route_id']">
<xsl:choose>
<xsl:when test="current-grouping-key() = $thing_id">
<xsl:text disable-output-escaping="yes">&lt;</xsl:text>
<xsl:call-template name="create-route-uri"><xsl:with-param name="id" select="current-grouping-key()"/></xsl:call-template>
<xsl:text disable-output-escaping="yes">#&gt;
</xsl:text>
<xsl:for-each select="current-group()">
<xsl:text disable-output-escaping="yes">	dct:Location [
		a						sf_ont:goal ;
		sf_ont:DescribedBy		sf_ont:place</xsl:text>
<xsl:value-of select="column[@name='spot_id']"/>
<!-- <xsl:value-of select="column[@name='spot_id']"/> -->
<!-- Her set me siste tegnet.. -->
<xsl:if test="position() != last()">
<xsl:text disable-output-escaping="yes"> ;
	] ;
	
</xsl:text>
</xsl:if>
<xsl:if test="position() = last()">
<xsl:text disable-output-escaping="yes"> ;
	] .
	
</xsl:text>
</xsl:if>
</xsl:for-each>
</xsl:when>
</xsl:choose>
</xsl:for-each-group>


<!-- ///////////////////////////////////////////////////////////////////////////////////////////////////
########################################################################################################
	DOMAIN MODEL - END


//////////////////////////////////////////////////////////////////////////////////////////////////// -->


		
		<!-- Terminalbeskjed kvar gong eit dokument vert generert. -->
		<xsl:message terminate="no"><xsl:value-of select="$dir_route_things"/>/<xsl:value-of select="$filename"/></xsl:message>
		<xsl:message terminate="no"><xsl:value-of select="$dir_route_documents"/>/m<xsl:value-of select="$filename"/></xsl:message>


<!-- ///////////////////////////////////////////////////////////////////////////////////////////////////


	INDEX CARD (ROUTE) - START
########################################################################################################
//////////////////////////////////////////////////////////////////////////////////////////////////// -->
<xsl:result-document format="xml" href="{$dir_route_things}/{$filename}">
<xsl:text disable-output-escaping="yes">@prefix owl: &lt;http://www.w3.org/2002/07/owl#&gt; .
@prefix owl-time: &lt;http://www.w3.org/2001/sw/BestPractices/OEP/Time-Ontology#&gt; .
@prefix muo: &lt;http://purl.oclc.org/NET/muo/muo#&gt; .
@prefix geo: &lt;http://www.w3.org/2003/01/geo/wgs84_pos#&gt; .
@prefix swap: &lt;http://www.w3.org/2000/10/swap/grammar/n3#&gt; .
@prefix sf_ont: &lt;http://data.sognefjord.vestforsk.no/resource/ontology#&gt; .
@prefix dct: &lt;http://purl.org/dc/terms/&gt; .

</xsl:text>

<!-- <column name="id"> -->
<xsl:text disable-output-escaping="yes">&lt;</xsl:text>
<xsl:call-template name="create-route-uri-name"><xsl:with-param name="id" select="column[@name='id']"/></xsl:call-template>
<xsl:text disable-output-escaping="yes">&gt;
	a						geo:SpatialThing ;
	
	a [
		sf_ont:Route		sf_ont:Hike ;
	] ;
	
</xsl:text>

<!-- <column name="name"> -->
<xsl:text disable-output-escaping="yes">	dct:title				"""</xsl:text>
<xsl:value-of select="column[@name='name']"/>
<xsl:text disable-output-escaping="yes">"""@no ;

</xsl:text>

<!-- <column name="length_in_time"> -->
<xsl:text disable-output-escaping="yes">	owl-time:duration [
		owl-time:minute		"""</xsl:text>
<xsl:value-of select="column[@name='length_in_time']"/>
<xsl:text disable-output-escaping="yes">""" ;
	] ;

</xsl:text>

<!-- <column name="length_in_km"> -->
<xsl:text disable-output-escaping="yes">	sf_ont:length [
		sf_ont:kilometer	"""</xsl:text>
<xsl:value-of select="column[@name='length_in_km']"/>
<xsl:text disable-output-escaping="yes">""" ;
	] ;

</xsl:text>

<!-- <column name="difficulty"> -->
<xsl:text disable-output-escaping="yes">	sf_ont:rate [</xsl:text>
<xsl:if test="column[@name='difficulty'] = 1">
<xsl:text disable-output-escaping="yes">
		sf_ont:degree_of_difficulty		sf_ont:easy</xsl:text>
<!-- <xsl:value-of select="column[@name='difficulty']"/> (IF 1 THEN "Easy")-->
<xsl:text disable-output-escaping="yes"> ;</xsl:text>
</xsl:if>
<xsl:if test="column[@name='difficulty'] = 2">
<xsl:text disable-output-escaping="yes">
		sf_ont:degree_of_difficulty		sf_ont:average</xsl:text>
<!-- <xsl:value-of select="column[@name='difficulty']"/> (IF 2 THEN "Average")-->
<xsl:text disable-output-escaping="yes"> ;</xsl:text>
</xsl:if>
<xsl:if test="column[@name='difficulty'] = 3">
<xsl:text disable-output-escaping="yes">
		sf_ont:degree_of_difficulty		sf_ont:hard</xsl:text>
<!-- <xsl:value-of select="column[@name='difficulty']"/> (IF 3 THEN "Hard")-->
<xsl:text disable-output-escaping="yes"> ;</xsl:text>
</xsl:if>
<xsl:if test="column[@name='difficulty'] = 4">
<xsl:text disable-output-escaping="yes">
		sf_ont:degree_of_difficulty		sf_ont:expert</xsl:text>
<!-- <xsl:value-of select="column[@name='difficulty']"/> (IF 4 THEN "Expert")-->
<xsl:text disable-output-escaping="yes"> ;</xsl:text>
</xsl:if>
<xsl:text disable-output-escaping="yes">
		sf_ont:Referee					&lt;http://tur.bt.no&gt; ;
</xsl:text>

<!-- <column name="stroller_friendly"> -->
<xsl:if test="column[@name='stroller_friendly'] = 1">
<xsl:text disable-output-escaping="yes">		sf_ont:adapted					sf_ont:stroller_friendly ;
</xsl:text>
<!-- <xsl:value-of select="column[@name='stroller_friendly']"/> (IF 1 THEN...)-->
</xsl:if>
<xsl:text disable-output-escaping="yes">	] ;

</xsl:text>

<!-- <column name="encoded_path"> -->
<xsl:text disable-output-escaping="yes">	sf_ont:Path [
		sf_ont:Google_encoded_path		"""</xsl:text>
<xsl:value-of select="column[@name='encoded_path']"/>
<xsl:text disable-output-escaping="yes">""" ;
	] ;
	
</xsl:text>

<!-- sameAs... <column name="id"> -->
<xsl:text disable-output-escaping="yes">	owl:sameAs [
		rdf:resource		&lt;http://tur.bt.no/tur/</xsl:text>
<xsl:value-of select="column[@name='id']"/>
<xsl:text disable-output-escaping="yes">&gt; ;
	] ;
	
</xsl:text>

<!-- <column name="created"> -->
<xsl:text disable-output-escaping="yes">	sf_ont:indexcard [
		dct:created				"""</xsl:text>
<!-- <xsl:value-of select="column[@name='created']"/>
(Bruk denne i staden dersom du vil ha "created" dato til tur.bt.no) -->
<xsl:value-of  select="current-dateTime()"/>
<xsl:text disable-output-escaping="yes">""" ;
		dct:creator				&lt;http://lars.berg.hustveit.org&gt; ;
		dct:contributor			&lt;http://tur.bt.no&gt; ;
		dct:contributor			&lt;http://uib.no&gt; ;
		dct:publisher			&lt;http://vestforsk.no&gt; ;
	] .
	
</xsl:text>
</xsl:result-document><!-- Dokument for ting slutt -->
<!-- ///////////////////////////////////////////////////////////////////////////////////////////////////
########################################################################################################
	INDEX CARD (ROUTE) - END


//////////////////////////////////////////////////////////////////////////////////////////////////// -->
<!-- ///////////////////////////////////////////////////////////////////////////////////////////////////


	DOCUMENT (ROUTE)- START
########################################################################################################
//////////////////////////////////////////////////////////////////////////////////////////////////// -->
<xsl:result-document format="xml" href="{$dir_route_documents}/m{$filename}">
<xsl:text disable-output-escaping="yes">@prefix sf_thing: &lt;http://..../&gt; .
</xsl:text>

<!-- <column name="id"> -->
<xsl:text disable-output-escaping="yes">&lt;</xsl:text>
<xsl:call-template name="create-route-uri-name"><xsl:with-param name="id" select="column[@name='id']"/></xsl:call-template>
<xsl:text disable-output-escaping="yes">&gt;
	a	...Thing... ;
</xsl:text>

<!-- <column name="name"> -->
<xsl:text disable-output-escaping="yes">	&lt;name&gt;		"""</xsl:text>
<xsl:value-of select="column[@name='name']"/>
<xsl:text disable-output-escaping="yes">"""@no ;
</xsl:text>

<!-- <column name="ingress"> -->
<xsl:text disable-output-escaping="yes">	&lt;ingress&gt;		"""</xsl:text>
<xsl:value-of select="column[@name='ingress']"/>
<xsl:text disable-output-escaping="yes">"""@no ;
</xsl:text>

<!-- <column name="description"> -->
<xsl:text disable-output-escaping="yes">	&lt;description&gt;		"""</xsl:text>
<xsl:value-of select="column[@name='description']"/>
<xsl:text disable-output-escaping="yes">"""@no ;
</xsl:text>

<!-- <column name="image"> -->
<xsl:text disable-output-escaping="yes">	&lt;image&gt;		&lt;http://turcache.bt.no/webroot/img/</xsl:text>
<xsl:value-of select="column[@name='image']"/>
<xsl:text disable-output-escaping="yes">&gt; ;
</xsl:text>

<!-- <column name="image_credit"> -->
<xsl:text disable-output-escaping="yes">	&lt;image_credit&gt;		"""</xsl:text>
<xsl:value-of select="column[@name='image_credit']"/>
<xsl:text disable-output-escaping="yes">""" ;
</xsl:text>

<!-- <column name="created"> -->
<xsl:text disable-output-escaping="yes">	&lt;created&gt;		"""</xsl:text>
<xsl:value-of select="column[@name='created']"/>
<xsl:text disable-output-escaping="yes">""" ;
</xsl:text>

</xsl:result-document><!-- Dokument for ting slutt -->
<!-- ///////////////////////////////////////////////////////////////////////////////////////////////////
########################################################################################################
	DOCUMENT (ROUTE) - END


//////////////////////////////////////////////////////////////////////////////////////////////////// -->
	</xsl:for-each><!-- Slutt på løkke for kvar rute -->
	
	<!--
	For-each: <table name="spots">
	-->
	<xsl:for-each select="table[@name='spots']">
	
		<!-- Lagar $thing_id -->
		<xsl:variable name="thing_id" select="concat(column[@name='id'],'')"/>
		<!-- Lagar $filename -->
		<xsl:variable name="filename" select="concat(column[@name='id'],'.ttl')"/>
		
		<!-- Terminalbeskjed kvar gong eit dokument vert generert. -->
		<xsl:message terminate="no"><xsl:value-of select="$dir_place_things"/>/<xsl:value-of select="$filename"/></xsl:message>
		<xsl:message terminate="no"><xsl:value-of select="$dir_place_documents"/>/m<xsl:value-of select="$filename"/></xsl:message>
	
		<!-- Lagar $gowalla_id -->
		<xsl:variable name="gowalla_id" select="concat(column[@name='gowalla_id'],'')"/>
	
<!-- ///////////////////////////////////////////////////////////////////////////////////////////////////


	INDEX CARD (PLACE) - START
########################################################################################################
//////////////////////////////////////////////////////////////////////////////////////////////////// -->
<xsl:result-document format="xml" href="{$dir_place_things}/{$filename}">
<xsl:text disable-output-escaping="yes">@prefix dct: &lt;http://purl.org/dc/terms/&gt; .
@prefix dbpedia-owl: &lt;http://dbpedia.org/ontology/&gt; .
@prefix geo: &lt;http://www.w3.org/2003/01/geo/wgs84_pos#&gt; .
@prefix owl: &lt;http://www.w3.org/2002/07/owl#&gt; .
@prefix rdf: &lt;http://www.w3.org/1999/02/22-rdf-syntax-ns#&gt; .

</xsl:text>

<!-- <column name="id"> -->
<xsl:text disable-output-escaping="yes">&lt;</xsl:text>
<xsl:call-template name="create-place-uri-name"><xsl:with-param name="id" select="column[@name='id']"/></xsl:call-template>
<xsl:text disable-output-escaping="yes">&gt;
	a						geo:SpatialThing ;
	
</xsl:text>

<!-- <column name="name"> -->
<xsl:text disable-output-escaping="yes">	dct:title				"""</xsl:text>
<xsl:value-of select="column[@name='name']"/>
<xsl:text disable-output-escaping="yes">"""@no ;

</xsl:text>

<!--
../<table name="gowallas"> - START
Hentar "gowalla" info som tilhøyrer denne plassen
-->
<xsl:for-each-group select="../table[@name='gowallas']" group-by="column[@name='id']">
<xsl:choose>
<xsl:when test="current-grouping-key() = $gowalla_id">
<xsl:for-each select="current-group()">

<!-- <column name="lat"> -->
<xsl:text disable-output-escaping="yes">	dct:location [
		a					dbpedia-owl:Place ;
		a					geo:Point ;
		
		geo:lat				"""</xsl:text>
<xsl:value-of select="column[@name='lat']"/>
<xsl:text disable-output-escaping="yes">""" ;
</xsl:text>

<!-- <column name="lng"> -->
<xsl:text disable-output-escaping="yes">		geo:long			"""</xsl:text>
<xsl:value-of select="column[@name='lng']"/>
<xsl:text disable-output-escaping="yes">""" ;
</xsl:text>

</xsl:for-each>
</xsl:when>
</xsl:choose>
</xsl:for-each-group>
<!--
../<table name="gowallas"> - SLUTT
-->

<!-- <column name="altitude"> -->
<xsl:text disable-output-escaping="yes">		geo:altitude		"""</xsl:text>
<xsl:value-of select="column[@name='altitude']"/>
<xsl:text disable-output-escaping="yes">""" ;
	] ;
	
</xsl:text>

<!-- <column name="serving"> (Deaktiverer denne fordi me ikkje vil ha med verdien vidare.)
<xsl:text disable-output-escaping="yes">	&lt;serving&gt;				"""</xsl:text>
<xsl:value-of select="column[@name='serving']"/>
<xsl:text disable-output-escaping="yes">""" ;
</xsl:text>
 -->

<!-- <column name="gowalla_id"> -->
<xsl:text disable-output-escaping="yes">	owl:sameAs [
		rdf:resource		&lt;http://gowalla.com/spots/</xsl:text>
<xsl:value-of select="column[@name='gowalla_id']"/>
<xsl:text disable-output-escaping="yes">&gt; ;
	] ;
	
</xsl:text>

<!-- About the index card -->
<xsl:text disable-output-escaping="yes">	sf_ont:indexcard [
		dct:created				"""</xsl:text>
<xsl:value-of  select="current-dateTime()"/>
<xsl:text disable-output-escaping="yes">""" ;
		dct:creator				&lt;http://lars.berg.hustveit.org&gt; ;
		dct:contributor			&lt;http://tur.bt.no&gt; ;
		dct:contributor			&lt;http://uib.no&gt; ;
		dct:publisher			&lt;http://vestforsk.no&gt; ;
	] .
</xsl:text>

</xsl:result-document>
<!-- ///////////////////////////////////////////////////////////////////////////////////////////////////
########################################################################################################
	INDEX CARD (PLACE) - END


//////////////////////////////////////////////////////////////////////////////////////////////////// -->
<!-- ///////////////////////////////////////////////////////////////////////////////////////////////////


	DOCUMENT (PLACE)- START
########################################################################################################
//////////////////////////////////////////////////////////////////////////////////////////////////// -->
<xsl:result-document format="xml" href="{$dir_place_documents}/m{$filename}">
<xsl:text disable-output-escaping="yes">@prefix sf_thing: &lt;http://..../&gt; .
</xsl:text>

<!-- <column name="id"> -->
<xsl:text disable-output-escaping="yes">&lt;</xsl:text>
<xsl:call-template name="create-place-uri-name"><xsl:with-param name="id" select="column[@name='id']"/></xsl:call-template>
<xsl:text disable-output-escaping="yes">&gt;
	a	...Thing... ;
</xsl:text>

<!-- <column name="name"> -->
<xsl:text disable-output-escaping="yes">	&lt;name&gt;		"""</xsl:text>
<xsl:value-of select="column[@name='name']"/>
<xsl:text disable-output-escaping="yes">"""@no ;
</xsl:text>

<!-- <column name="ingress"> -->
<xsl:text disable-output-escaping="yes">	&lt;ingress&gt;		"""</xsl:text>
<xsl:value-of select="column[@name='ingress']"/>
<xsl:text disable-output-escaping="yes">"""@no ;
</xsl:text>

<!-- <column name="description"> -->
<xsl:text disable-output-escaping="yes">	&lt;description&gt;		"""</xsl:text>
<xsl:value-of select="column[@name='description']"/>
<xsl:text disable-output-escaping="yes">"""@no ;
</xsl:text>

<!-- <column name="image"> -->
<xsl:text disable-output-escaping="yes">	&lt;image&gt;		&lt;http://turcache.bt.no/webroot/img/</xsl:text>
<xsl:value-of select="column[@name='image']"/>
<xsl:text disable-output-escaping="yes">&gt; ;
</xsl:text>

<!-- <column name="image_credit"> -->
<xsl:text disable-output-escaping="yes">	&lt;image_credit&gt;		"""</xsl:text>
<xsl:value-of select="column[@name='image_credit']"/>
<xsl:text disable-output-escaping="yes">""" ;
</xsl:text>

<!-- <column name="trimtoppen_image"> -->
<xsl:text disable-output-escaping="yes">	&lt;trimtoppen_image&gt;		&lt;http://turcache.bt.no/webroot/img/</xsl:text>
<xsl:value-of select="column[@name='trimtoppen_image']"/>
<xsl:text disable-output-escaping="yes">&gt; ;
</xsl:text>

<!-- <column name="trimtoppen_description"> -->
<xsl:text disable-output-escaping="yes">	&lt;trimtoppen_description&gt;		"""</xsl:text>
<xsl:value-of select="column[@name='trimtoppen_description']"/>
<xsl:text disable-output-escaping="yes">"""@no ;
</xsl:text>

<!-- <column name="trimtoppen_image_credit"> -->
<xsl:text disable-output-escaping="yes">	&lt;trimtoppen_image_credit&gt;		"""</xsl:text>
<xsl:value-of select="column[@name='trimtoppen_image_credit']"/>
<xsl:text disable-output-escaping="yes">""" ;
</xsl:text>

<!-- <column name="created"> -->
<xsl:text disable-output-escaping="yes">	&lt;created&gt;		"""</xsl:text>
<xsl:value-of select="column[@name='created']"/>
<xsl:text disable-output-escaping="yes">""" ;
</xsl:text>

<!-- <column name="modified"> -->
<xsl:text disable-output-escaping="yes">	&lt;modified&gt;		"""</xsl:text>
<xsl:value-of select="column[@name='modified']"/>
<xsl:text disable-output-escaping="yes">""" ;
</xsl:text>

<!--
../<table name="gowallas">
No skal me hente "gowalla" info som tilhøyrer denne plassen
-->
<xsl:for-each-group select="../table[@name='gowallas']" group-by="column[@name='id']">
<xsl:choose>
<xsl:when test="current-grouping-key() = $gowalla_id">
<xsl:for-each select="current-group()">

<!-- <column name="name"> -->
<xsl:text disable-output-escaping="yes">	&lt;gowalla_name&gt;		"""</xsl:text>
<xsl:value-of select="column[@name='name']"/>
<xsl:text disable-output-escaping="yes">"""@no ;
</xsl:text>

<!-- <column name="description"> -->
<xsl:text disable-output-escaping="yes">	&lt;gowalla_description&gt;		"""</xsl:text>
<xsl:value-of select="column[@name='description']"/>
<xsl:text disable-output-escaping="yes">"""@no ;
</xsl:text>

</xsl:for-each>
</xsl:when>
</xsl:choose>
</xsl:for-each-group>


</xsl:result-document>
<!-- ///////////////////////////////////////////////////////////////////////////////////////////////////
########################################################################################################
	DOCUMENT (PLACE) - END


//////////////////////////////////////////////////////////////////////////////////////////////////// -->


	</xsl:for-each><!-- Slutt på løkke for kvar plass -->
	
	
<!-- ///////////////////////////////////////////////////////////////////////////////////////////////////


	semantic.ttl - START
########################################################################################################
//////////////////////////////////////////////////////////////////////////////////////////////////// -->
<xsl:message terminate="no"><xsl:value-of select="$dir_semantic"/>/semantic.ttl</xsl:message>
<xsl:result-document format="xml" href="{$dir_semantic}/semantic.ttl">
<xsl:text disable-output-escaping="yes">@prefix owl:     &lt;http://www.w3.org/2002/07/owl#&gt; .
@prefix ml: &lt;http://data.sognefjord.vestforsk.no/resource/ml-ontology#&gt; .
@prefix sf_route: &lt;http://data.sognefjord.vestforsk.no/resource/route/&gt; .
@prefix sf_ont: &lt;http://data.sognefjord.vestforsk.no/resource/ontology#&gt; .

</xsl:text>

<!--
For-each: <table name="routes">
-->
<xsl:for-each select="table[@name='routes']">

<!-- <column name="id"> -->
<xsl:text disable-output-escaping="yes">&lt;</xsl:text>
<xsl:call-template name="create-route-uri"><xsl:with-param name="id" select="column[@name='id']"/></xsl:call-template>
<xsl:text disable-output-escaping="yes">#&gt;
	a						owl:Individual .
	
sf_ont:route</xsl:text><xsl:value-of select="column[@name='id']"/>
<xsl:text disable-output-escaping="yes">
	ml:NameOf				sf_route:</xsl:text><xsl:value-of select="column[@name='id']"/>
<xsl:text disable-output-escaping="yes"># .

</xsl:text>

</xsl:for-each><!-- Slutt på løkke for kvar <table name="routes"> -->
</xsl:result-document>
<!-- ///////////////////////////////////////////////////////////////////////////////////////////////////
########################################################################################################
	semantic.ttl - END


//////////////////////////////////////////////////////////////////////////////////////////////////// -->
	
	
</xsl:template><!-- Slutt på ..... -->




<!-- ///////////////////////////////////////////////////////////////////////////////////////////////////
	METHODS - START
########################################################################################################
//////////////////////////////////////////////////////////////////////////////////////////////////// -->












<!-- ///////////////////////////////////////////////////////////////////////////////////////////////////
########################################################################################################
	METHODS - END
//////////////////////////////////////////////////////////////////////////////////////////////////// -->
<!-- ///////////////////////////////////////////////////////////////////////////////////////////////////
	CONVENIENCE METHODS - START
########################################################################################################
//////////////////////////////////////////////////////////////////////////////////////////////////// -->

<xsl:template name="create-route-uri-name">
	<xsl:param name="id"/>http://data.sognefjord.vestforsk.no/resource/ontology#route<xsl:value-of select="$id"/>
</xsl:template>

<xsl:template name="create-place-uri-name">
	<xsl:param name="id"/>http://data.sognefjord.vestforsk.no/resource/ontology#place<xsl:value-of select="$id"/>
</xsl:template>

<xsl:template name="create-route-uri">
	<xsl:param name="id"/>http://data.sognefjord.vestforsk.no/resource/route/<xsl:value-of select="$id"/>
</xsl:template>

<xsl:template name="create-place-uri">
	<xsl:param name="id"/>http://data.sognefjord.vestforsk.no/resource/place/<xsl:value-of select="$id"/>
</xsl:template>

<!-- ///////////////////////////////////////////////////////////////////////////////////////////////////
########################################################################################################
	CONVENIENCE METHODS - END
//////////////////////////////////////////////////////////////////////////////////////////////////// -->





</xsl:stylesheet>