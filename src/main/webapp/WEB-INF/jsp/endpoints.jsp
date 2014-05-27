<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="security" uri="http://www.springframework.org/security/tags" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="Kai Schlegel, M.Sc. - University of Passau">

    <title>Balloon Fusion</title>

    <link href="<c:url value="/static/boostrap2/css/bootstrap.min.css"/>" rel="stylesheet" media="screen">
    <%--<link href="<c:url value="/static/boostrap2/css/bootstrap-theme.min.css"/>" rel="stylesheet" media="screen">--%>
    <link href="<c:url value="/static/css/custom.css"/>" rel="stylesheet" media="screen">
    <link rel="shortcut icon" href="/static/icon.png" type="image/png">
</head>

<body>

<div class="container">

    <div class="masthead">
        <img src="static/balloon_logo3.png" style="width: 400px;margin-bottom: 10px;" alt="Balloon - Consuming Linked Data"/>
        <ul class="nav nav-justified">
            <li><a href="#">Home</a></li>
            <li><a href="#">Demonstation</a></li>
            <li class="active"><a href="#">Data</a></li>
            <li><a href="http://code-research.eu/">CODE-Project</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
        </ul>
    </div>

    <!-- Jumbotron -->
    <div class="jumbotron">
        <h2>Underlying Data Sources</h2>
        <p>Following data sources are crawled for important triples to enable a global and unified view.</p>
    </div>

    <security:authorize ifAllGranted="ROLE_USER">
    <div class="well">
        <a href="#" id="addEndpoint" class="btn btn-small btn-warning"><i class="icon-plus-sign icon-white"></i>Add Endpoint</a>
    </div>

    </security:authorize>

    <div class="row">
        <div class="col-lg-3 col-sm-6 col-xs-6 col-xxs-12">
            <div class="smallstat box">
                <span class="icon blue"><span class="glyphicon glyphicon-signal"></span></span>
                <span class="title">Endpoints</span>
                <span class="value"><c:out value="${endpoints.size()}"/></span>
            </div>
        </div><!--/col-->
        <div class="col-lg-3 col-sm-6 col-xs-6 col-xxs-12">
            <div class="smallstat box">
                <span class="icon red"><span class="glyphicon glyphicon-signal"></span></span>
                <span class="title">Different URIs</span>
                <span class="value"><c:out value="${numberOfRessources}"/></span>
            </div>
        </div><!--/col-->
        <div class="col-lg-3 col-sm-6 col-xs-6 col-xxs-12">
            <div class="smallstat box">
                <span class="icon green"><span class="glyphicon glyphicon-signal"></span></span>
                <span class="title">Equivalence Cluster</span>
                <span class="value">NaN</span>
            </div>
        </div><!--/col-->
        <div class="col-lg-3 col-sm-6 col-xs-6 col-xxs-12">
            <div class="smallstat box">
                <span class="icon yellow"><span class="glyphicon glyphicon-signal"></span></span>
                <span class="title">N/A</span>
                <span class="value">NaN</span>
            </div>
        </div><!--/col-->
    </div>

    <h3>Endpoints</h3>
    <div class="endpoint">
        <span class="keyValuePair"><span class="value"><c:out value="${endpoints.size()}"/></span> <span class="key">Endpoints</span></span>
        <span class="keyValuePair"><span class="value"><c:out value="${numberOfNew}" default="NaN"/></span> <span class="key">Unindexed</span></span>
        <span class="keyValuePair"><span class="value"><c:out value="${numberOfFinished}" default="NaN"/></span> <span class="key">Indexed</span></span>
        <span class="keyValuePair"><span class="value"><c:out value="${numberOfActive}" default="NaN"/></span> <span class="key">Active</span></span>
        <span class="keyValuePair"><span class="value"><c:out value="${numberOfError}" default="NaN"/></span> <span class="key">Error</span></span>

        Toogles:
        <div class="btn-group btn-group-sm">
        <button type="button" data-filter=".endpointnew" class="filterButton btn btn-default">new <span class="badge blue"><c:out value="${numberOfNew}" default="NaN"/></span></button>
        <button type="button" data-filter=".endpointready"  class="filterButton btn btn-default">finished <span class="badge green"><c:out value="${numberOfFinished}" default="NaN"/></span></button>
        <button type="button" data-filter=".endpointactive"  class="filterButton btn btn-default">active <span class="badge yellow"><c:out value="${numberOfActive}" default="NaN"/></span></button>
        <button type="button" data-filter=".endpointerror"  class="filterButton btn btn-default">error <span class="badge red"><c:out value="${numberOfError}" default="NaN"/></span></button>
        </div>
    </div>

    <c:if test="${ ! empty endpoints}">
        <c:set var="totalNumber" value="0" />
        <c:set var="endpointIDs" value="\"\"" />
        <c:forEach items="${endpoints}" var="endpoint">
            <%--<c:set var="totalNumber" value="${totalNumber + endpoint.sameAsCount}" />--%>
            <%--for lod map--%>
            <c:choose>
                <c:when test="${endpoint.status eq 'CRAWLED'}"><c:set var="endpointIDs" value="\"${endpoint.endpointID}\", ${endpointIDs}" /></c:when>
            </c:choose>


            <c:choose>
                <c:when test="${endpoint.status eq 'NEW'}"><div class="endpoint endpointnew"></c:when>
                <c:when test="${endpoint.status eq 'SCHEDULED'}"><div class="endpoint endpointactive"></c:when>
                <c:when test="${endpoint.status eq 'PROCESSING'}"><div class="endpoint endpointactive"></c:when>
                <c:when test="${endpoint.status eq 'CRAWLED'}"><div class="endpoint endpointready"></c:when>
                <c:when test="${endpoint.status eq 'ERROR'}"><div class="endpoint endpointerror"></c:when>
                <c:when test="${endpoint.status eq 'EXCLUDED'}"><div class="endpoint endpointerror"></c:when>
                <c:otherwise><div class="endpoint"></c:otherwise>
            </c:choose>
                <h3><c:out value="${endpoint.endpointID}"/></h3>
                <div>
                    <security:authorize ifAllGranted="ROLE_USER">
                        <a href="<c:url value="/endpoints/index/endpoint/"/><c:out value="${endpoint.endpointID}"/>" class="btn btn-primary" type="button">Index</a>
                    </security:authorize>
                    <a class="btn btn-info" href="<c:out value="${endpoint.url}"/>"><span class="glyphicon glyphicon-home"></span> Homepage</a>
                    <a class="btn btn-info" href="<c:out value="${endpoint.sparqlEndpoint}"/>"><span class="glyphicon glyphicon-search"></span> SPARQL Endpoint</a>

                    <span class="keyValuePair" style="width: 200px;"><span class="value"><c:out value="${endpoint.namespace}" default="n/a"/></span> <span class="key">Namespace</span></span>

                    <%--<c:set var="createdParts" value="${fn:split(endpoint.metadata_created, 'T')}" />--%>
                    <%--<span class="keyValuePair"><span class="value"><c:out value="${createdParts[0]}"/></span> <span class="key">Created</span></span>--%>

                    <%--<c:set var="modifiedParts" value="${fn:split(endpoint.metadata_modified, 'T')}" />--%>
                    <%--</span><span class="keyValuePair"><span class="value"><c:out value="${modifiedParts[0]}"/></span> <span class="key">Modified</span></span>--%>

                    <span class="keyValuePair"><span class="value"><fmt:formatDate value="${endpoint.added}" pattern="yyyy-MM-dd" /></span> <span class="key">Added</span></span>

                    <span class="keyValuePair"><span class="value"><fmt:formatDate value="${endpoint.lastUpdated}" pattern="yyyy-MM-dd" /></span> <span class="key">Updated</span></span>

                    <span class="keyValuePair">
                    <c:choose>
                    <c:when test="${endpoint.status eq 'NEW'}"><span class="value fblue">new</span></c:when>
                    <c:when test="${endpoint.status eq 'SCHEDULED'}"><span class="value fyellow">queued</span></c:when>
                    <c:when test="${endpoint.status eq 'PROCESSING'}"><span class="value fyellow">active</span></c:when>
                    <c:when test="${endpoint.status eq 'CRAWLED'}"><span class="value fgreen">ok</span></c:when>
                    <c:when test="${endpoint.status eq 'ERROR'}"><span class="value fred">error</span></c:when>
                    <c:when test="${endpoint.status eq 'EXCLUDED'}"><span class="value fred">excluded</span></c:when>
                    <c:otherwise><span class="value">n/a</span></c:otherwise>
                    </c:choose>
                    <span class="key">Updated</span></span>
                </div>

                <%--class="tool" data-toggle="tooltip" title="Namespace: "--%>
                    <%--<td><span class="badge badge-inverse"><c:out value="${endpoint.sameAsCount}"/></span></td>--%>
                <c:choose>
                    <c:when test="${endpoint.status eq 'NEW'}"><div class="status blue"><span>&nbsp;</span></div></c:when>
                    <c:when test="${endpoint.status eq 'SCHEDULED'}"><div class="status yellow"><span>&nbsp;</span></div></c:when>
                    <c:when test="${endpoint.status eq 'PROCESSING'}"><div class="status yellow"><span>&nbsp;</span></div></c:when>
                    <c:when test="${endpoint.status eq 'CRAWLED'}"><div class="status green"><span>&nbsp;</span></div></c:when>
                    <c:when test="${endpoint.status eq 'ERROR'}"><div class="status red"><span>&nbsp;</span></div></c:when>
                    <c:when test="${endpoint.status eq 'EXCLUDED'}"><div class="status red"><span>&nbsp;</span></div></c:when>
                    <c:otherwise><div class="status blue"><span>&nbsp;</span></div></c:otherwise>
                </c:choose>

            </div>

        </c:forEach>
    </c:if>

    <h3>Indexed LOD Endpoints</h3>
    <img id="lod_logo" class="svg" src="<c:url value="/static/lod-2011.svg"/>"/>

    <!-- Site footer -->
    <div class="footer">
        <p>CODE Project - This is research in progress</p>
    </div>

</div> <!-- /container -->


<script src="http://code.jquery.com/jquery-latest.js"></script>
<script src="<c:url value="/static/boostrap2/js/bootstrap.min.js"/>"></script>
<script src="<c:url value="/static/js/custom.js"/>"></script>
<script>
    var endpointIDs=new Array(<c:out escapeXml="false" value="${endpointIDs}"/>);

    $(document).ready(function(){
        $('.tool').tooltip();
        $('#addEndpoint').popover({
            html : true,
            content: function() {
                return $('#addEndpointPopOver').html();
            }
        });
        $('.tool').tooltip();

        $('.filterButton').click(function (){
            var filter = $(this).attr('data-filter');
            $(filter).fadeToggle( "slow", "swing" );
            $(this).toggleClass('disabledFilter');
        });

        jQuery('img.svg').each(function(){
            var $img = jQuery(this);
            var imgID = $img.attr('id');
            var imgClass = $img.attr('class');
            var imgURL = $img.attr('src');

            jQuery.get(imgURL, function(data) {
                // Get the SVG tag, ignore the rest
                var $svg = jQuery(data).find('svg');

                // Add replaced image's ID to the new SVG
                if(typeof imgID !== 'undefined') {
                    $svg = $svg.attr('id', imgID);
                }
                // Add replaced image's classes to the new SVG
                if(typeof imgClass !== 'undefined') {
                    $svg = $svg.attr('class', imgClass+' replaced-svg');
                }

                // Remove any invalid XML tags as per http://validator.w3.org
                $svg = $svg.removeAttr('xmlns:a');

                // Replace image with new SVG
                $img.replaceWith($svg);


                // set all endpoints to unused
                $('a.dataset circle').css('fill','#ffffff');
                $('a.dataset circle').css('stroke','#2E4439');
                $('a.dataset circle').css('opacity','0.1');
                $('a.dataset text').css('opacity','0.6');

                for(endpointIDKey in endpointIDs) {
                    var endpointID = endpointIDs[endpointIDKey];
                    $('#dataset-' + endpointID + ' circle').removeAttr('style');
                    $('#dataset-' + endpointID + ' text').removeAttr('style');
                }

            });

        });
    });
</script>
</body>
</html>
