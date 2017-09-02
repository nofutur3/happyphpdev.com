<?php

namespace Deployer;

require 'recipe/common.php';

// Configuration

set('repository', 'git@bitbucket.org:jvyvazil/happyphpdev.com.git');
set('git_tty', true); // [Optional] Allocate tty for git on first deployment
set('shared_files', ['.env']);
set('shared_dirs', ['web/app/uploads']);
set('writable_dirs', ['web/app/uploads']);
//set('clear_path', ['var/temp/cache']);

// Hosts

host('162.243.2.128')
	->user('deploy')
	->port(22)
	->forwardAgent(true)
	->identityFile('~/.ssh/id_rsa')
	->stage('production')
	->set('deploy_path', '/srv/happyphpdev.com');

desc('Deploy your project');
task('deploy', [
	'deploy:prepare',
	'deploy:lock',
	'deploy:release',
	'deploy:update_code',
	'deploy:shared',
	'deploy:writable',
	'deploy:vendors',
	'deploy:clear_paths',
	'deploy:symlink',
	'deploy:unlock',
	'cleanup',
	'success',
]);

// [Optional] if deploy fails automatically unlock.
after('deploy:failed', 'deploy:unlock');
