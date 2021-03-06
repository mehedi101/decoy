<?php namespace Bkwld\Decoy\Fields\Former;

// Dependencies
use Illuminate\Support\Str;

/**
 * Override the getClassFromMethod() so that it doesn't destroy casing
 */
class MethodDispatcher extends \Former\MethodDispatcher {

	/**
	 * Override the parent so that study class names are respected on
	 * case sensitive file systems.
	 *
	 * @param  string $method The field created
	 * @return string The correct class
	 */
	protected function getClassFromMethod($method) {

		// Look for a studly class
		$class = Str::singular(Str::studly($method));
		foreach ($this->repositories as $repository) {
			if (class_exists($repository.$class)) return $repository.$class;
		}

		// Resume normal functioning
		return parent::getClassFromMethod($method);
	}

}