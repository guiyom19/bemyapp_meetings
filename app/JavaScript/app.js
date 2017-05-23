var app = angular.module('meetingModule', ['ngFileUpload']);
 
app.controller('meetingHandler', ['$scope','Upload', '$http', function ($scope, Upload, $http) 
{

	$scope.edit=false;

	// affichage des données en base
	$scope.display=function()
	{
		$http.get('/api/display')
		.success(function(data)
		{
			if (data!='err')
			{
				$scope.meetings=data;
			}
		})
	}
	
    // gestion de l'upload des logos
    $scope.upload = function (file)
    {
        Upload.upload({
            url: 'http://localhost:8080/upload',
            data:{file:file} 
        }).then(function (resp) 
        { 
            if(resp.data.error_code === 0)
            { 
              $scope.display();
            } else 
            {
               alert("erreur lors de l'import du logo");
            }
        }, function (resp) // gestion de l'erreur
        { 
            console.log('Error status: ' + resp.status);
           
        }, function (evt) // progression de l'import
        { 
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            $scope.progress = 'progress: ' + progressPercentage + '% '; 
        });
    };

    // envoi des données du formulaire d'ajout de conférence
	$scope.sendForm=function(file)
	{
		if($scope.meeting.name != null && $scope.meeting.date != null)
		{

			$scope.meeting.logo = file.name;
			$scope.upload(file);

			$http.post('/api/form',$scope.meeting)
			.success(function(data)
			{
				if (data=='err')
				{
					alert("Un problème est survenu lors de l'enregistrement des données !");
				}
				else
				{
					alert("Conférence enregistrée !");
				}
				$scope.meeting={};
				$scope.display();
			})
		}
	}

	// suppression d'une conférence
	$scope.deleteMeeting=function(meeting)
	{
		if(confirm("Souhaitez-vous vraiment supprimer "+meeting.name+" du "+meeting.date+" ?"))
		{
			$http.delete('/api/delete/'+meeting._id)
			.success(function(data)
			{
				
				if (data!='err')
				{
					$scope.display();
				}
				else
				{
					alert("Un problème est survenu à la suppression !");
				}
			})
		}
		
	}

	//modification d'une conférence
	$scope.modifyMeeting=function(p)
	{
		$scope.edit=true;
		$scope.sheet=p;
	}

	// execution de la modification
	$scope.doEdition=function(file)
	{
		$scope.sheet.logo = file.name;

		if ($scope.meeting.name==null) $scope.meeting.name=$scope.sheet.name;

		if ($scope.meeting.description==null) $scope.meeting.description=$scope.sheet.description;

		if ($scope.meeting.date==null) $scope.meeting.date=$scope.sheet.date;
	
		if ($scope.meeting.logo==null)	$scope.meeting.logo=$scope.sheet.logo;
	
		$http.put('/api/edit/'+$scope.sheet._id,$scope.meeting)
		.success(function(data)
		{
		
			$scope.edit=false;
			$scope.meeting="";
			if (data!='err')
			{
				$scope.display();

				$scope.upload(file);
			}
			else
			{
				alert("Un problème est survenu à la modification !");
			}
		})
	}

	// annulation d'édition
	$scope.cancelEdition=function()
	{
		$scope.edit=false;
	}

	// appel de l'affichage des données au chargement
	$scope.display();
}]);

