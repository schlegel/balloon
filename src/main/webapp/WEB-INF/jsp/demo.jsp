<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html>
<html>
<head>
    <title>CODE Balloon</title>
    <!-- Bootstrap -->
    <link href="<c:url value="/static/bootstrap/css/bootstrap.min.css"/>" rel="stylesheet" media="screen">
    <link href="<c:url value="/static/css/custom.css?v2"/>" rel="stylesheet" media="screen">
    <link rel="shortcut icon" href="/static/icon.png" type="image/png">
</head>
<body>

<div class="navbar navbar-inverse navbar-fixed-top">
    <div class="navbar-inner">
        <div class="container">
            <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </a>
            <a class="brand" href="#">CODE Balloon</a>
            <div class="nav-collapse collapse">
                <ul class="nav">
                    <li class="active"><a href="/">Home</a></li>
                    <li><a href="http://code-research.eu/">CODE-Project</a></li>
                </ul>
            </div><!--/.nav-collapse -->
        </div>
    </div>
</div>

<div class="container">
    <!-- Main hero unit for a primary marketing message or call to action -->
    <div class="hero-unit">
        <h1>CODE Balloon</h1>
        <p>Demonstration of the capabilites of the CODE Balloon API</p>
        <small>CODE-Balloon attempts to create an overall and interlinked view on the Linked Data Cloud. Regarding the big picture of the Linked Data
            project we have highly interlinked data available, which can be easily queried separately on each endpoint. But a convenient request
            considering the overall data isn't possible at all. Given a specific concept, it's hard to find all relevant information, which
            is distributed over several endpoints. CODE Balloons aims to index and unify basic and important 'interlinking'-information of LOD
            endpoints to generate a simplified sub-graph. Based on this data, CODE Balloon offers some public interfaces like SPARQL rewriting or retrieving of equivalent sameAs-Groups </small>

    </div>

    <div class="well">
        <div>Number of Endpoints: <span class="badge badge-inverse"><c:out value="${endpoints}"/></span> </div>
        <div>Number of sameAs-Cluster: <span class="badge badge-inverse"><c:out value="${numberOfClusters}"/></span> </div>
        <div>Number of included sameAs Statements: <span class="badge badge-inverse"><c:out value="${sameAsCount}"/></span> </div>
        <div style="margin-top: 10px;">
            <a class="btn btn-primary" href="<c:url value="/endpoints"/>">Read more</a> about the underlying Dataset
        </div>
    </div>

    <div class="well">
        <h3>Demos:</h3>
        <ul>
            <li><a href="#rewrite">SPARQL rewrite</a></li>
            <li><a href="#federation">SPARQL rewrite with federation</a></li>
            <li><a href="#sameAs">SameAs-Cluster</a></li>
        </ul>
    </div>


    <h3><a name="rewrite">SPARQL Rewrite</a></h3>
    <form class="bs-docs-example form-inline">
        <div class="well">The SPARQL query will be expanded by the "synonym"-URLs retrieved from the corresponding equivalent sameAs-Group. To improve the result set, all known and suitable SPARQL endpoints can be added using the SPARQL 1.1 SERVICE clause.</div>
        <label>SPARQL Query:</label>
        <textarea id="transformInput" rows="6" placeholder="Enter SPARQL SELECT query">
SELECT ?p ?o WHERE {
    <http://vocabulary.semantic-web.at/AustrianSkiTeam/121> ?p ?o.
}
        </textarea>
        <label class="checkbox inline">
            <input type="checkbox" id="serviceClauseCheck" value="serviceClause" checked="checked"> include SPARQL 1.1 SERVICE Clause
        </label>

        <div style="margin-top: 20px;">
            <button id="transform" class="btn btn-primary" type="button">Transform</button>
        </div>

        <div id="transformResultContainer"  class="result" style="display: none;">
            <textarea id="transformResult" rows="10" ></textarea>
        </div>
    </form>

    <h3><a name="federation">Automatic SPARQL Federation</a></h3>
    <form class="bs-docs-example form-inline">
        <div class="well">The SPARQL query will be rewritten using the above mentioned strategy and automatically distributed to the resolved SPARQL endpoints for a convenient single-point access to Linked Data.</div>
        <label>SPARQL Query:</label>
        <textarea id="federateInput" rows="6" placeholder="Enter SPARQL SELECT query">
SELECT ?p ?o WHERE {
<http://enipedia.tudelft.nl/wiki/Kuroda_Kansai_Powerplant> ?p ?o.
FILTER isLiteral(?o)
}
        </textarea>
        <div style="margin-top: 20px;">
            <button id="federate" class="btn btn-primary" type="button">Federate</button>
        </div>

        <div id="federateResultContainer"  class="result" style="display: none;overflow:scroll;">
            <textarea id="federateResult" rows="10" ></textarea>
        </div>
    </form>

    <h3><a name="sameAs">sameAs-Cluster</a></h3>
    <form class="bs-docs-example form-inline">
        <div class="well">If the given URL is already indexed, the corresponding equivalent sameAs-Group is returned</div>
        <label>URL:</label>
        <input id="equivalentSetInput" type="text" class="broad" placeholder="Enter URL" value="http://vocabulary.semantic-web.at/AustrianSkiTeam/121">

        <div style="margin-top: 20px;">
            <button id="equivalentSet" class="btn btn-primary" type="button">Get equivalent set</button>
        </div>

        <div id="equivalentSetResult" class="result" style="display: none;">
        </div>
    </form>

    <%--<h3>Resolve Endpoint</h3>--%>
    <%--<form class="bs-docs-example form-inline">--%>
        <%--<div class="well">It's often a problem to know, which endpoint is "responsible" for a URL. This service determine the appropriate SPARQL endpoint for a given URL</div>--%>
        <%--<label>URL:</label>--%>
        <%--<input type="text" id="resolveInput" class="broad" placeholder="Enter URL" value="http://vocabulary.semantic-web.at/AustrianSkiTeam/121">--%>

        <%--<div style="margin-top: 20px;">--%>
            <%--<button id="resolve" class="btn btn-primary" type="button">Get SPARQL Endpoint</button>--%>
        <%--</div>--%>

        <%--<div id="resolveResult" class="result" style="display: none;">--%>
        <%--</div>--%>
    <%--</form>--%>

    <hr>

    <footer>
        <p>CODE Project - This is research in progress</p>
    </footer>

</div> <!-- /container -->

<script src="http://code.jquery.com/jquery-latest.js"></script>
<script src="<c:url value="/static/bootstrap/js/bootstrap.min.js"/>"></script>
<script src="<c:url value="/static/js/jquery.tablesorter.js"/>"></script>
<script src="<c:url value="/static/js/custom.js"/>"></script>
<script src="<c:url value="/static/js/plugins.js"/>"></script>

<script>
    $(document).ready(function(){
        $('#transform').click(function() {
            var data = {'query' : $('#transformInput').val(), 'serviceClause' : $('#serviceClauseCheck').is(':checked') };
            var resultField = $('#transformResult');
            var resultFieldContainer = $('#transformResultContainer');

            resultFieldContainer.hide();

            bootbox.dialog('<h2 style="text-align: center;">Loading ...</h2><div class="progress progress-striped active"><div class="bar uploadProgress" style="width: 100%;"></div></div>', []);
            $.post('sparql', data, function(data) {
                bootbox.hideAll()
                if(data.status === '200') {
                    resultField.val(data.result);
                } else {
                    resultField.val('ERROR');
                }

                resultFieldContainer.slideDown();
            });
        });

        function xmlToString(xmlData) {

            var xmlString;
            //IE
            if (window.ActiveXObject){
                xmlString = xmlData.xml;
            }
            // code for Mozilla, Firefox, Opera, etc.
            else{
                xmlString = (new XMLSerializer()).serializeToString(xmlData);
            }
            return xmlString;
        }

        $('#federate').click(function() {
            var data = {'query' : $('#federateInput').val(), 'table' : true};
            var resultField = $('#federateResult');
            var resultFieldContainer = $('#federateResultContainer');

            resultFieldContainer.hide();

            bootbox.dialog('<h2 style="text-align: center;">Loading ...</h2><div class="progress progress-striped active"><div class="bar uploadProgress" style="width: 100%;"></div></div>', []);
            $.post('sparql/execute', data, function(data) {
                //resultField.val(xmlToString(data));
                bootbox.hideAll()
                resultFieldContainer.html(data);
                resultFieldContainer.slideDown();
            });
        });

        $('#equivalentSet').click(function() {
            var data = {'url' : $('#equivalentSetInput').val()};
            var resultField = $('#equivalentSetResult');

            resultField.hide();
            $.post('sameas',data , function(data) {
                if(data.status === '200') {

                    var innerHtml = '<div class="endpointID">Cluster:</div>'

                    innerHtml += data.sameAs.join().replace(/,/g, '<br />');
                    innerHtml += '<div class="endpointID">Origin:</div>';

                     for(var key in data.sameAsRelations) {
                         var enpointData = data.sameAsRelations[key];
                         innerHtml += '<div class="endpointID">' + enpointData.endpointID + '</div>';

                         for(var innerKey in enpointData.sameAsLinks) {
                            var link = enpointData.sameAsLinks[innerKey];
                             innerHtml += '<div class="link">' + link + '</div>';
                         }
                     }

                    resultField.html(innerHtml);


                } else {
                   resultField.html('NOT FOUND');
                }

                resultField.slideDown();
            });
        });

        $('#resolve').click(function() {
            var data = {'url' : $('#resolveInput').val()};
            var resultField = $('#resolveResult');

            resultField.hide();
            $.post('sameas/resolve',data , function(data) {
                if(data.status === '200') {
                    resultField.text(data.sparql);
                } else {
                    resultField.text('NOT FOUND');
                }

                resultField.slideDown();
            });
        });
    });

</script>
</body>
</html>