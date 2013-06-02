<!--

	Lars Berg Hustveit
	lars.berg@hustveit.org

	XSLT 2.0, XSLT 2.0 Prosessor: Saxon-HE 9.3
	
	Oppretta: 11.12.2011
	Sist oppdatert: 11.12.2011
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





<!-- Start within: <pma_xml_export> -->
<xsl:template match="pma_xml_export/database" >


<!-- ///////////////////////////////////////////////////////////////////////////////////////////////////



	DOMAIN MODEL - START
	
########################################################################################################
//////////////////////////////////////////////////////////////////////////////////////////////////// -->


	<xsl:message terminate="no">/domain_model.ttl</xsl:message>


	<xsl:text disable-output-escaping="yes">testing</xsl:text>


	<!--
	For-each: <table name="routes">
	-->
	<xsl:for-each select="table[@name='routes']">
	
		<!-- Testing testing... -->
		<xsl:value-of select="column[@name='id']"/>
		<xsl:value-of select="column[@name='name']"/>





<!-- ///////////////////////////////////////////////////////////////////////////////////////////////////
########################################################################################################
	DOMAIN MODEL - END


//////////////////////////////////////////////////////////////////////////////////////////////////// -->

		<!-- Lagar $thing_id -->
		<xsl:variable name="thing_id" select="concat(column[@name='id'],'')"/>
		<!-- Lagar $filename -->
		<xsl:variable name="filename" select="concat(column[@name='id'],'.ttl')"/>
		
		<!-- Terminalbeskjed kvar gong eit dokument vert generert. -->
		<xsl:message terminate="no"><xsl:value-of select="$dir_route_things"/>/<xsl:value-of select="$filename"/></xsl:message>
		<xsl:message terminate="no"><xsl:value-of select="$dir_route_documents"/>/m<xsl:value-of select="$filename"/></xsl:message>


<!-- ///////////////////////////////////////////////////////////////////////////////////////////////////


	INDEX CARD (ROUTE) - START
########################################################################################################
//////////////////////////////////////////////////////////////////////////////////////////////////// -->
<xsl:result-document format="xml" href="{$dir_route_things}/{$filename}">
<xsl:text disable-output-escaping="yes">@prefix sf_thing: &lt;http://..../&gt; .
</xsl:text>

<!-- <column name="id"> -->
<xsl:text disable-output-escaping="yes">&lt;</xsl:text>
<xsl:call-template name="create-route-uri-name"><xsl:with-param name="id" select="column[@name='id']"/></xsl:call-template>
<xsl:text disable-output-escaping="yes">&gt;
	a	...Thing... ;
</xsl:text>

<!-- sameAs... <column name="id"> -->
<xsl:text disable-output-escaping="yes">	&lt;sameAs&gt;		&lt;http://tur.bt.no/tur/</xsl:text>
<xsl:value-of select="column[@name='id']"/>
<xsl:text disable-output-escaping="yes">&gt; ;
</xsl:text>

<!-- <column name="name"> -->
<xsl:text disable-output-escaping="yes">	&lt;name&gt;		"""</xsl:text>
<xsl:value-of select="column[@name='name']"/>
<xsl:text disable-output-escaping="yes">"""@no ;
</xsl:text>

<!-- <column name="length_in_time"> -->
<xsl:text disable-output-escaping="yes">	&lt;length_in_time&gt;		"""</xsl:text>
<xsl:value-of select="column[@name='length_in_time']"/>
<xsl:text disable-output-escaping="yes">""" ;
</xsl:text>

<!-- <column name="length_in_km"> -->
<xsl:text disable-output-escaping="yes">	&lt;length_in_km&gt;		"""</xsl:text>
<xsl:value-of select="column[@name='length_in_km']"/>
<xsl:text disable-output-escaping="yes">""" ;
</xsl:text>

<!-- <column name="difficulty"> -->
<xsl:text disable-output-escaping="yes">	&lt;difficulty&gt;		"""</xsl:text>
<xsl:value-of select="column[@name='difficulty']"/>
<xsl:text disable-output-escaping="yes">""" ;
</xsl:text>

<!-- <column name="stroller_friendly"> -->
<xsl:text disable-output-escaping="yes">	&lt;stroller_friendly&gt;		"""</xsl:text>
<xsl:value-of select="column[@name='stroller_friendly']"/>
<xsl:text disable-output-escaping="yes">""" ;
</xsl:text>

<!-- <column name="created"> -->
<xsl:text disable-output-escaping="yes">	&lt;created&gt;		"""</xsl:text>
<xsl:value-of select="column[@name='created']"/>
<xsl:text disable-output-escaping="yes">""" ;
</xsl:text>

<!-- <column name="encoded_path"> -->
<xsl:text disable-output-escaping="yes">	&lt;encoded_path&gt;		"""</xsl:text>
<xsl:value-of select="column[@name='encoded_path']"/>
<xsl:text disable-output-escaping="yes">""" ;
</xsl:text>

<!--
../<table name="routes_spots">
No skal me hente alle "spots" som tilhøyrer denne ruta
-->
<xsl:for-each-group select="../table[@name='routes_spots']" group-by="column[@name='route_id']">
<xsl:choose>
<xsl:when test="current-grouping-key() = $thing_id">
<xsl:for-each select="current-group()">
<xsl:text disable-output-escaping="yes">	&lt;routes_spots&gt;		"""http://__thing_place_uri__</xsl:text>
<xsl:value-of select="column[@name='spot_id']"/>
<xsl:text disable-output-escaping="yes">""" ;
</xsl:text>
</xsl:for-each>
</xsl:when>
</xsl:choose>
</xsl:for-each-group>


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

<!-- <column name="altitude"> -->
<xsl:text disable-output-escaping="yes">	&lt;altitude&gt;		"""</xsl:text>
<xsl:value-of select="column[@name='altitude']"/>
<xsl:text disable-output-escaping="yes">""" ;
</xsl:text>

<!-- <column name="serving"> -->
<xsl:text disable-output-escaping="yes">	&lt;serving&gt;		"""</xsl:text>
<xsl:value-of select="column[@name='serving']"/>
<xsl:text disable-output-escaping="yes">""" ;
</xsl:text>

<!-- <column name="gowalla_id"> -->
<xsl:text disable-output-escaping="yes">	&lt;sameAS_gowalla_id&gt;		&lt;http://gowalla.com/spots/</xsl:text>
<xsl:value-of select="column[@name='gowalla_id']"/>
<xsl:text disable-output-escaping="yes">&gt; ;
</xsl:text>

<!--
../<table name="gowallas">
No skal me hente "gowalla" info som tilhøyrer denne plassen
-->
<xsl:for-each-group select="../table[@name='gowallas']" group-by="column[@name='id']">
<xsl:choose>
<xsl:when test="current-grouping-key() = $gowalla_id">
<xsl:for-each select="current-group()">

<!-- <column name="lng"> -->
<xsl:text disable-output-escaping="yes">	&lt;gowalla_lng&gt;		"""</xsl:text>
<xsl:value-of select="column[@name='lng']"/>
<xsl:text disable-output-escaping="yes">""" ;
</xsl:text>

<!-- <column name="lat"> -->
<xsl:text disable-output-escaping="yes">	&lt;gowalla_lat&gt;		"""</xsl:text>
<xsl:value-of select="column[@name='lat']"/>
<xsl:text disable-output-escaping="yes">""" ;
</xsl:text>

</xsl:for-each>
</xsl:when>
</xsl:choose>
</xsl:for-each-group>


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
	<xsl:param name="id"/>http://data.......vestforsk.no/resource/ontology#route<xsl:value-of select="$id"/>
</xsl:template>

<xsl:template name="create-place-uri-name">
	<xsl:param name="id"/>http://data.......vestforsk.no/resource/ontology#place<xsl:value-of select="$id"/>
</xsl:template>


<!-- ///////////////////////////////////////////////////////////////////////////////////////////////////
########################################################################################################
	CONVENIENCE METHODS - END
//////////////////////////////////////////////////////////////////////////////////////////////////// -->





</xsl:stylesheet>